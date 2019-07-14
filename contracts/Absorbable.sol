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
    using absn for absn.Preemptive;

    // constants
    uint ENDURIO_BLOCK;
    uint MAX_DURATION = 1 weeks / 2 seconds;
    int MIN_DURATION = int(MAX_DURATION / 2);

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
        triggerAbsorption(StablizeToken.totalSupply(), false);
    }

    modifier consensus() {
        require(msg.sender == address(0x0), "consensus only");
        _;
    }

    // called by the consensus on each block
    // median price = target / StablizeToken.totalSupply()
    // zero target is fed for no median price available
    function onBlockInitialized(uint target) public consensus {
        if (isExpired()) {
            // absorption takes no longer than one duration
            clearLastAbsorption();
        }
        if (target > 0) { // absorption block
            onMedianPriceFed(target);
            if (lockdown.isLocked()) {
                // WIP: slash the pre-emptive maker if target goes wrong way
                int diviation = math.sub(target, StablizeToken.totalSupply());
                if (checkAndSlash(diviation) && last.isPreemptive) {
                    // lockdown violation, halt the preemptive absorption for this block
                    return;
                }
            }
        }
        if (isAbsorbing()) {
            int nextAmount = calcNextAbsorption();
            absorb(nextAmount);
        }
    }

    function onMedianPriceFed(uint target) internal {
        if (ENDURIO_BLOCK + MAX_DURATION <= block.number) {
            return;
        }
        if (shouldTriggerPassive() || shouldTriggerActive(StablizeToken.totalSupply(), target)) {
            triggerAbsorption(target, false);
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

    // shouldTriggerPassive returns whether a new passive absorption can be activated
    // passive condition: 1 duration without any active absorption or absorption never occurs
    function shouldTriggerPassive() internal view returns (bool) {
        return !isAbsorbing();
    }

    // shouldTriggerActive returns whether the new target is sufficient to trigger a new active absorption
    // make things simple by compare only the (target-supply) instead (target-supply)/supply
    function shouldTriggerActive(uint supply, uint target) internal view returns (bool) {
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
        return last.number > 0 &&
            last.number + MAX_DURATION < block.number;
    }

    function getLastAbsorption() public view
        returns(uint number, uint supply, uint target, bool isPreemptive)
    {
        return (last.number, last.supply, last.target, last.isPreemptive);
    }

    function setLastAbsorption(uint number, uint supply, uint target, bool isPreemptive) internal {
        last.number = number;
        last.supply = supply;
        last.target = target;
        last.isPreemptive = isPreemptive;
    }

    function clearLastAbsorption() internal {
        delete last;
    }

    function clearLockdown() internal {
        delete lockdown;
    }

    function triggerAbsorption(uint target, bool isPreemptive) internal {
        last = absn.Absorption(block.number, StablizeToken.totalSupply(), target, isPreemptive);
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

    /**
     * @dev slash the initiator whenever the price is moving in
     * opposition direction with the initiator's direction,
     * the initiator's deposited balance will be minus by _amount
     *
     * _amount is the NTY value need to be burn, calculate in the consensus level
     * _amount = |d/D|/SlashingDuration
     * d = MedianPriceDeviation
     * D = X/S, X is the amount of NewSD will be absorbed, S is the current NewSD total supply
     * consensus need to update the balance to burn amount return from calling slash function
     *
     * @return true if the lockdown is violated and get slashed
     */
    function checkAndSlash(int diviation) internal returns (bool) {
        if (!math.inOrder(lockdown.amount, 0, diviation)) {
            // same direction, no slashing
            return false;
        }
        // lockdown violated
        uint slashed = uint(-diviation/lockdown.amount) / lockdown.slashingDuration;
        if (slashed == 0) {
            slashed = 1; // minimum 1 wei
        }
        if (lockdown.stake < slashed) {
            slashed = lockdown.stake;
            // there's nothing at stake anymore, clear the lockdown and its absorption
            clearLastAbsorption();
            clearLockdown();
        }
        lockdown.stake -= slashed;
        VolatileToken.dexBurn(slashed);
        // this slashed NTY will be burnt by the consensus by calling setBalance
        return true;
    }
}