pragma solidity ^0.5.2;

import "./interfaces/IOwnableERC223.sol";

contract Initializer {
    mapping(bool => IOwnableERC223) token;

    bool constant volatileType = false;
    bool constant stableType = true;

    constructor ()
        public
    {

    }

    function volatileTokenRegister(address _address)
        public
    {
        // SellType false
        require(address(token[volatileType]) == address(0), "already set");
        token[volatileType] = IOwnableERC223(_address);
    }

    function stableTokenRegister(address _address)
        public
    {
        // BuyType true
        require(address(token[stableType]) == address(0), "already set");
        token[stableType] = IOwnableERC223(_address);
    }
}