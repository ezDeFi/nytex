pragma solidity ^0.5.2;

import "./set.sol";
import "./dex.sol";

library absn {
    using set for set.AddressSet;
    using dex for dex.Order;
    using dex for dex.Book;

    address constant ZERO_ADDRESS = address(0x0);

    using absn for Absorption;
    struct Absorption {
        uint number; // block number the absorpion is activated
        uint supply; // StablizeToken supply at the activation block
        uint target; // StablizeToken target supply for the active
        bool isPreemptive;
    }

    using absn for Proposal;
    struct Proposal {
        // address of the proposer
        address maker;

        // amount of StablizeToken to absorb, positive for inflation, negative for deflation
        int amount;

        // NTY amount staked for the preemptive proposal
        uint stake;

        // lockdown duration (in blocks from the activation)
        uint lockdownDuration;

        // SlashingDuration = 1 / SlashingRate
        // slashed = |d/D|*SlashingRate
        //  d = MedianPriceDeviation
        //  D = X/S, X is the amount of StablizeToken will be absorbed, S is the current NewSD total supply
        uint slashingDuration;

        // block number the proposal is proposed
        uint number;

        // voters set
        set.AddressSet upVoters;
        set.AddressSet downVoters;
    }

    function voteUp(Proposal storage this) internal {
        this.downVoters.remove(msg.sender);
        this.upVoters.push(msg.sender);
    }

    function voteDown(Proposal storage this) internal {
        this.upVoters.remove(msg.sender);
        this.downVoters.push(msg.sender);
    }

    function exists(Proposal storage this) internal view returns (bool) {
        return (this.maker != ZERO_ADDRESS);
    }

    struct Preemptive {
        address maker;
        int amount;
        uint stake;
        uint slashingDuration;

        // block number the lockdown will end
        uint unlockNumber;
    }
    using absn for Preemptive;

    function exists(Preemptive storage this) internal view returns (bool) {
        return this.maker != ZERO_ADDRESS;
    }

    function isLocked(Preemptive storage this) internal view returns (bool) {
        return this.exists() && block.number < this.unlockNumber;
    }

    function unlockable(Preemptive storage this) internal view returns (bool) {
        return this.exists() && this.unlockNumber <= block.number;
    }
}
