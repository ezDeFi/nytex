pragma solidity ^0.5.2;

import "./absn.sol";

library map {
    using absn for absn.Proposal;

    // Iterable map of (address => Proposal)
    // index = ordinals[a]-1
    // vals[index].maker = a
    using map for ProposalMap;
    struct ProposalMap {
        absn.Proposal[] vals;
        mapping (address => uint) ordinals; // map the proposal's maker to (its index + 1)
    }

    function count(ProposalMap storage this) internal view returns (uint) {
        return this.vals.length;
    }

    function get(ProposalMap storage this, uint index) internal view returns (absn.Proposal storage) {
        return this.vals[index];
    }

    function get(ProposalMap storage this, address maker) internal view returns (absn.Proposal storage) {
        return this.vals[this.ordinals[maker]-1];
    }

    function has(ProposalMap storage this, address maker) internal view returns (bool) {
        return this.ordinals[maker] > 0;
    }

    function push(ProposalMap storage this, absn.Proposal memory proposal) internal returns (absn.Proposal storage) {
        uint ordinal = this.ordinals[proposal.maker];
        require (ordinal == 0, "maker already has a proposal");
        ordinal = this.ordinals[proposal.maker] = this.vals.push(proposal);
        return this.vals[ordinal-1];
    }

    function remove(ProposalMap storage this, address maker) internal returns (bool success) {
        uint ordinal = this.ordinals[maker];
        if (ordinal == 0) {
            return false;
        }
        this.remove(ordinal-1);
        return true;
    }

    // index is the correct array index, which is (set.ordinals[item]-1)
    function remove(ProposalMap storage this, uint index) internal {
        delete this.ordinals[this.vals[index].maker];
        //this.vals[index].clear(); // should be handled differently for user and consensus

        if (this.vals.length-1 != index) {
            // swap with the last item in the vals
            this.vals[index] = this.vals[this.vals.length-1];
            this.ordinals[this.vals[index].maker] = index + 1;
        }
        // remove the last item from the array
        delete this.vals[this.vals.length-1];
        this.vals.length--;
    }

    function clear(ProposalMap storage this) internal {
        for (uint i = 0; i < this.vals.length; i++) {
            delete this.ordinals[this.vals[i].maker];
        }
        delete this.vals;
    }

    ///////////////////////////////////////////////////////////////////////

    // Iterable map of (address => bool)
    // index = ordinals[a]-1
    // keys[index] = a
    using map for AddressBool;
    struct AddressBool {
        address[] keys;
        mapping (address => uint) ordinals; // map the voter's adress to (its index + 1)
        mapping (address => bool) vals;
    }

    function count(AddressBool storage this) internal view returns (uint) {
        return this.keys.length;
    }

    function getKey(AddressBool storage this, uint index) internal view returns (address) {
        return this.keys[index];
    }

    function get(AddressBool storage this, uint index) internal view returns (address, bool) {
        address key = this.getKey(index);
        return (key, this.vals[key]);
    }

    function get(AddressBool storage this, address key) internal view returns (bool) {
        return this.vals[key];
    }

    function has(AddressBool storage this, address key) internal view returns (bool) {
        return this.ordinals[key] > 0;
    }

    /**
     * @return true if new (key,val) is added, false if old key is map to a new value
     */
    function set(AddressBool storage this, address key, bool val) internal returns (bool) {
        this.vals[key] = val;
        uint ordinal = this.ordinals[key];
        if (ordinal == 0) {
            this.ordinals[key] = this.keys.push(key);
            return true;
        }
        if (ordinal > this.keys.length || this.keys[ordinal-1] != key) {
            // storage inconsistency due to deleting proposal without clearing proposal.votes
            this.ordinals[key] = this.keys.push(key);
            return true;
        }
        // key already has a proposal
        return false;
    }

    function remove(AddressBool storage this, address key) internal {
        uint ordinal = this.ordinals[key];
        require(ordinal > 0, "key not exist");
        this.remove(ordinal-1, key);
    }

    function remove(AddressBool storage this, uint index) internal {
        address key = this.keys[index];
        require(key != address(0x0), "index not exist");
        this.remove(index, key);
    }

    // unsafe internal function
    function remove(AddressBool storage this, uint index, address key) internal {
        delete this.ordinals[key];
        delete this.vals[key];

        if (this.keys.length-1 != index) {
            // swap with the last item in the keys and delete it
            this.keys[index] = this.keys[this.keys.length-1];
            this.ordinals[this.keys[index]] = index + 1;
        }
        // remove the last item from the array
        delete this.keys[this.keys.length-1];
        this.keys.length--;
    }

    function clear(AddressBool storage this) internal {
        for (uint i = 0; i < this.keys.length; i++) {
            address key = this.keys[i];
            delete this.ordinals[key];
            delete this.vals[key];
        }
        delete this.keys;
    }
}