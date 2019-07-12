pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/math/Math.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "./lib/math.sol";
import "./lib/dex.sol";
import "./lib/absn.sol";
import "./Orderbook.sol";

contract Absorbable is Orderbook {
    using SafeMath for uint;
    using dex for dex.Book;

    // constants
    uint ENDURIO_BLOCK;
    uint MAX_DURATION = 1 weeks / 2 seconds;
    int MIN_DURATION = int(MAX_DURATION) / 2;

    // last absorption
    absn.Absorption internal last;
    // lockdown tracks the active and current being lockdown pre-emptive absorption
    absn.Preemptive internal lockdown;

    constructor (
        address volatileTokenAddress,
        address stablizeTokenAddress,
        uint maxDuration,
        uint minDuration
    )
        Orderbook(volatileTokenAddress, stablizeTokenAddress)
        public
    {
        ENDURIO_BLOCK = block.number;
        if (maxDuration > 0) MAX_DURATION = maxDuration;
        MIN_DURATION = int(minDuration > 0 ? minDuration : maxDuration / 2);
        // dummy absorption
        last = absn.Absorption(
            block.number,
            StablizeToken.totalSupply(),
            StablizeToken.totalSupply(),
            false
        );
    }

    // called by the consensus on each block
    // median price = target / StablizeToken.totalSupply()
    // zero target is fed for no median price available
    function onBlockInitialize(uint target) public {
        require(msg.sender == address(0x0), "consensus only");
        if (isExpired()) {
            // absorption takes no longer than one duration
            clearLastAbsorption();
        }
        if (target > 0) { // absorption block
            onMedianPriceFed(target);
        }
        if (isAbsorbing()) {
            int nextAmount = calcNextAbsorption();
            absorb(nextAmount);
        }
    }

    function onMedianPriceFed(uint target) internal {
        if (block.number < ENDURIO_BLOCK + MAX_DURATION) {
            // no absorption in the first duration
            return;
        }
        // TODO: check pre-emptive
        if (passivable() || activable(StablizeToken.totalSupply(), target)) {
            last = absn.Absorption(block.number, StablizeToken.totalSupply(), target, false);
            return;
        }
    }

    function calcNextAbsorption() internal view returns(int) {
        int total = math.sub(last.target, last.supply);
        int remain = math.sub(last.target, StablizeToken.totalSupply());
        if (total == 0 || remain == 0) {
            // no absorption require or target reached
            return 0;
        }
        if (total > 0 != remain > 0) {
            // target passed
            return 0;
        }
        return remain / MIN_DURATION;
    }

    // passivable returns whether a new passive absorption can be activated
    // passive condition: 1 duration without any active absorption or absorption never occurs
    function passivable() internal view returns (bool) {
        return !isAbsorbing();
    }

    // activable returns whether the new target is sufficient to trigger a new active absorption
    // make things simple by compare only the (target-supply) instead (target-supply)/supply
    function activable(uint supply, uint target) internal view returns (bool) {
        if (target == supply) {
            return false;
        }
        if (last.target == last.supply) {
            return true;
        }
        uint rate;
        if (target > supply) {
            uint a = target - supply;
            if (last.target > last.supply) {
                uint b = last.target - last.supply;
                //return a * last.supply >= 2 * b * supply;
                rate = a / b;
            } else {
                uint b = last.supply - last.target;
                //return a * last.supply * 2 <= b * supply;
                rate = b / a;
            }
        } else {
            uint a = supply - target;
            if (last.target < last.supply) {
                uint b = last.supply - last.target;
                //return a * last.supply >= 2 * b * supply;
                rate = a / b;
            } else {
                uint b = last.supply - last.target;
                //return a * last.supply * 2 <= b * supply;
                rate = b / a;
            }
        }
        return rate >= 2;
    }

    function isAbsorbing() public view returns(bool) {
        return last.number > 0 &&
            last.target != last.supply &&
            !isExpired();
    }

    function isExpired() public view returns(bool) {
        return last.number + MAX_DURATION < block.number;
    }

    function getLastAbsorption() public view
        returns(uint number, uint supply, uint target, bool isPreemptive)
    {
        return (last.number, last.supply, last.target, last.isPreemptive);
    }

    function setLastAbsorption(uint number, uint supply, uint target, bool isPreemptive) public {
        last.number = number;
        last.supply = supply;
        last.target = target;
        last.isPreemptive = isPreemptive;
    }

    function clearLastAbsorption() public {
        delete last;
    }

    function absorb(
        int stableTokenAmount
    )
        internal
        returns(uint totalVOL, uint totalSTB)
    {
        bool inflate = stableTokenAmount > 0;
        uint amount = uint(inflate ? stableTokenAmount : -stableTokenAmount);
        bool orderType = inflate ? Ask : Bid; // inflate by filling NTY sell orders
        dex.Book storage book = books[orderType];
        bool useHaveAmount = book.haveToken == StablizeToken;
        if (last.isPreemptive) {
            return book.absorbPreemptive(useHaveAmount, amount, lockdown.maker);
        }
        return book.absorb(useHaveAmount, amount);
    }
}