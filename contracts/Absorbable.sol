pragma solidity ^0.5.2;

import "./lib/math.sol";
import "./lib/dex.sol";
import "./lib/absn.sol";
import "./Orderbook.sol";

/**
 * Mechanisms of absorption logic: active, passive and pre-emptive.
 */
contract Absorbable is Orderbook {
    using dex for dex.Book;
    using absn for absn.Absorption;
    using absn for absn.Preemptive;

    // constants
    uint EXPIRATION = 1 weeks / 2 seconds;
    int DURATION = int(EXPIRATION / 2);

    // last absorption
    absn.Absorption internal last;
    // lockdown tracks the active and current being lockdown pre-emptive absorption
    absn.Preemptive internal lockdown;

    constructor (
        address volatileTokenAddress,
        address stablizeTokenAddress,
        uint expiration,
        uint duration
    )
        Orderbook(volatileTokenAddress, stablizeTokenAddress)
        public
    {
        if (expiration > 0) EXPIRATION = expiration;
        DURATION = int(duration > 0 ? duration : expiration / 2);
        // dummy absorption
        triggerAbsorption(StablizeToken.totalSupply(), false);
    }

    modifier consensus() {
        require(msg.sender == address(0x0), "consensus only");
        _;
    }

    function getRemainToAbsorb() public view returns (int) {
        return math.sub(last.target, StablizeToken.totalSupply());
    }

    // called by the consensus on each block
    // median price = target / StablizeToken.totalSupply()
    // zero target is fed for no median price available
    function onBlockInitialized(uint target) public consensus {
        if (last.isExpired()) {
            // absorption takes no longer than one duration
            delete last;
        }
        if (lockdown.unlockable()) {
            unlock();
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
        if (last.isAbsorbing(StablizeToken.totalSupply())) {
            int nextAmount = calcNextAbsorption();
            absorb(nextAmount);
        }
    }

    function onMedianPriceFed(uint target) internal {
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
        return remain / DURATION;
    }

    // shouldTriggerPassive returns whether a new passive absorption can be activated
    // passive condition: 1 duration without any active absorption or absorption never occurs
    function shouldTriggerPassive() internal view returns (bool) {
        return last.isExpired();
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

    function unlock() internal {
        if (!lockdown.exists()) {
            return;
        }
        if (lockdown.stake > 0) {
            VolatileToken.transfer(lockdown.maker, lockdown.stake);
        }
        delete lockdown;
    }

    function triggerAbsorption(uint target, bool isPreemptive) internal {
        last = absn.Absorption(block.number + EXPIRATION,
            StablizeToken.totalSupply(),
            target,
            isPreemptive);
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
            delete last;
            unlock();
        }
        lockdown.stake -= slashed;
        VolatileToken.dexBurn(slashed);
        // this slashed NTY will be burnt by the consensus by calling setBalance
        return true;
    }
}