pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/math/Math.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./lib/set.sol";
import "./lib/map.sol";
import "./lib/dex.sol";
import "./lib/absn.sol";
import "./Absorbable.sol";

contract PairEx is Absorbable {
    using SafeMath for uint;
    using dex for dex.Order;
    using dex for dex.Book;
    using absn for absn.Proposal;
    using absn for absn.Preemptive;
    using map for map.ProposalMap;
    using set for set.AddressSet;

    address constant ZERO_ADDRESS = address(0x0);

    // adapting global default parameters, only used if proposal maker doesn't specify them
    uint internal globalLockdownDuration;
    uint internal globalSlashingRate;

    // proposal params must not lower than 1/3 of global params
    uint constant PARAM_TOLERANCE = 3;

    // proposal must have atleast globalLockdownDuration/4 block to be voted
    // note: using globalLockdownDuration instead of proposal's value for safety
    uint constant MIN_VOTING_DURATION = 4;

    // map (maker => Proposal)
    map.ProposalMap internal proposals;

    constructor (
        address volatileTokenAddress,
        address stablizeTokenAddress,
        uint initialLockdownDuration,
        uint initialSlashingRate,
        uint maxDuration,
        uint minDuration
    )
        Absorbable(volatileTokenAddress, stablizeTokenAddress, maxDuration, minDuration)
        public
    {
        globalLockdownDuration = initialLockdownDuration;
        globalSlashingRate = initialSlashingRate;
    }

    // Token transfer's fallback
    // bytes _data = uint[2] = (wantAmount, assistingID)
    // RULE : delegateCall never used
    //
    // buy/sell order is created by sending token to this address,
    // with extra data = (wantAmount, assistingID)
    function tokenFallback(
        address maker,  // actual tx sender
        uint value,     // amount of ERC223(msg.sender) received
        bytes calldata data)
        external
    {
        // if MNTY is received and data contains 3 params
        if (data.length == 32*3 && msg.sender == address(VolatileToken)) {
            // pre-emptive absorption proposal
            require(!proposals.has(maker), "already has a proposal");

            (   int amount,
                uint lockdownDuration,
                uint slashingRate
            ) = abi.decode(data, (int, uint, uint));

            propose(maker, value, amount, lockdownDuration, slashingRate);
            return;
        }

        // not a pre-emptive proposal, fallback to Orderbook trader order
        (uint wantAmount, bytes32 assistingID) = (data.length == 32) ?
            (abi.decode(data, (uint         )), bytes32(0)) :
            (abi.decode(data, (uint, bytes32))            );

        super.trade(maker, value, wantAmount, assistingID);
    }

    function onBlockInitialized(uint target) public consensus {
        checkAndTriggerPreemptive();
        super.onBlockInitialized(target);
    }

    function propose(
        address maker,
        uint stake,
        int amount,
        uint lockdownDuration,
        uint slashingRate
    )
        internal
    {
        absn.Proposal memory proposal;
        proposal.maker = maker;
        proposal.stake = stake;
        proposal.amount = amount;
        proposal.number = block.number;

        if (lockdownDuration > 0) {
            require(
                lockdownDuration >=
                globalLockdownDuration - globalLockdownDuration / PARAM_TOLERANCE,
                "lockdown duration param too short");
        } else {
            proposal.lockdownDuration = globalLockdownDuration;
        }

        if (slashingRate > 0) {
            require(
                slashingRate >=
                globalSlashingRate - globalSlashingRate / PARAM_TOLERANCE,
                "slashing rate param too low");
        } else {
            proposal.slashingRate = globalSlashingRate;
        }

        proposals.push(proposal);
    }

    // check and trigger a new Preemptive when one is eligible
    // return the true if a new preemptive is activated
    function checkAndTriggerPreemptive() internal returns (bool) {
        if (lockdown.isLocked()) {
            // there's current active or lockdown absorption
            return false;
        }
        address bestMaker = calcBestProposal();
        if (bestMaker == ZERO_ADDRESS) {
            // no eligible proposals
            return false;
        }
        triggerPreemptive(bestMaker);
        return true;
    }

    // trigger an absorption from a maker's proposal
    function triggerPreemptive(address maker) internal {
        absn.Proposal storage proposal = proposals.get(maker);
        lockdown = absn.Preemptive(
            proposal.maker,
            proposal.amount,
            proposal.stake,
            proposal.slashingRate,
            block.number + proposal.lockdownDuration
        );
        proposals.remove(maker);
        triggerAbsorption(math.add(StablizeToken.totalSupply(), lockdown.amount), true);
    }

    // deactive the current absorption
    function deactivate() internal {
        // ...
    }

    // unlock the lockdown absorption
    function unlock() internal {
        // ...
    }

    // expensive calculation, only consensus can affort this
    function calcRank(absn.Proposal storage proposal) internal view returns (uint) {
        uint vote = 0;
        for (uint i = 0; i < proposal.upVoters.count(); ++i) {
            address voter = proposal.upVoters.get(i);
            vote += voter.balance + VolatileToken.balanceOf(voter);
        }
        for (uint i = 0; i < proposal.downVoters.count(); ++i) {
            address voter = proposal.downVoters.get(i);
            vote -= voter.balance + VolatileToken.balanceOf(voter);
        }
        if (vote <= 0) {
            return 0;
        }
        return proposal.stake * vote;
    }

    // expensive calculation, only consensus can affort this
    function calcBestProposal() internal view returns (address) {
        uint bestRank = 0;
        address bestMaker = ZERO_ADDRESS;
        for (uint i = 0; i < proposals.count(); ++i) {
            absn.Proposal storage proposal = proposals.get(i);
            if (block.number - proposal.number < globalLockdownDuration / MIN_VOTING_DURATION) {
                // not enough time for voting
                continue;
            }
            uint rank = calcRank(proposal);
            if (rank > bestRank) {
                bestRank = rank;
                bestMaker = proposal.maker;
            }
        }
        return bestMaker;
    }
}