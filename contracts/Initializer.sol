pragma solidity ^0.5.2;

import "./interfaces/IOwnableERC223.sol";

contract Initializer {
    IOwnableERC223 VolatileToken;
    IOwnableERC223 StablizeToken;

    bool public constant Ask = false;
    bool public constant Bid = true;

    constructor ()
        public
    {

    }

    function volatileTokenRegister(address _address)
        public
    {
        // SellType false
        require(address(VolatileToken) == address(0), "already set");
        VolatileToken = IOwnableERC223(_address);
    }

    function stableTokenRegister(address _address)
        public
    {
        // BuyType true
        require(address(StablizeToken) == address(0), "already set");
        StablizeToken = IOwnableERC223(_address);
    }
}