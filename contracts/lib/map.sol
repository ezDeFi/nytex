pragma solidity ^0.5.2;

import "./absn.sol";

library map {
    using absn for absn.Proposal;

    // Iterable map of (address => Proposal)
    // index = ordinals[a]-1
    // keys[index].maker = a
    using map for ProposalMap;
    struct ProposalMap {
        address[] keys;
        mapping (address => uint) ordinals;      // map the proposal's maker to (its index + 1)
        mapping (address => absn.Proposal) vals; // maker => proposal
    }

    function count(ProposalMap storage this) internal view returns (uint) {
        return this.keys.length;
    }

    function getKey(ProposalMap storage this, uint index) internal view returns (address) {
        return this.keys[index];
    }

    function get(ProposalMap storage this, uint index) internal view returns (absn.Proposal storage) {
        address key = this.getKey(index);
        return this.vals[key];
    }

    function get(ProposalMap storage this, address maker) internal view returns (absn.Proposal storage) {
        return this.vals[maker];
    }

    function has(ProposalMap storage this, address maker) internal view returns (bool) {
        return this.ordinals[maker] > 0;
    }

    function push(ProposalMap storage this, absn.Proposal memory proposal) internal returns (absn.Proposal storage) {
        address key = proposal.maker;
        uint ordinal = this.ordinals[key];
        require (ordinal == 0, "maker already has a proposal");
        this.vals[key] = proposal;
        this.ordinals[key] = this.keys.push(key);
        return this.vals[key];
    }

    function remove(ProposalMap storage this, address maker) internal returns (bool success) {
        uint ordinal = this.ordinals[maker];
        require(ordinal > 0, "key not exist");
        this.remove(ordinal-1, maker);
        return true;
    }

    // index is the correct array index, which is (set.ordinals[item]-1)
    function remove(ProposalMap storage this, uint index) internal {
        address key = this.keys[index];
        require(key != address(0x0), "index not exist");
        this.remove(index, key);
    }

    // @require keys[index] == maker
    function remove(ProposalMap storage this, uint index, address maker) internal {
        delete this.ordinals[maker];
        delete this.vals[maker];

        if (this.keys.length-1 != index) {
            // swap with the last item in the keys and delete it
            this.keys[index] = this.keys[this.keys.length-1];
            this.ordinals[this.keys[index]] = index + 1;
        }
        // delete the last item from the array
        this.keys.length--;
    }

    function clear(ProposalMap storage this) internal {
        for (uint i = 0; i < this.keys.length; i++) {
            address key = this.keys[i];
            delete this.ordinals[key];
            delete this.vals[key];
        }
        delete this.keys;
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

    // @require keys[index] == key
    function remove(AddressBool storage this, uint index, address key) internal {
        delete this.ordinals[key];
        delete this.vals[key];

        if (this.keys.length-1 != index) {
            // swap with the last item in the keys and delete it
            this.keys[index] = this.keys[this.keys.length-1];
            this.ordinals[this.keys[index]] = index + 1;
        }
        // delete the last item from the array
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