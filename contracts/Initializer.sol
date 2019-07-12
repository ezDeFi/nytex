pragma solidity ^0.5.2;

import "./interfaces/IToken.sol";

contract Initializer {
    IToken VolatileToken;
    IToken StablizeToken; // intentional incorrect spelling

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
        VolatileToken = IToken(_address);
    }

    function stablizeTokenRegister(address _address)
        public
    {
        // BuyType true
        require(address(StablizeToken) == address(0), "already set");
        StablizeToken = IToken(_address);
    }
}