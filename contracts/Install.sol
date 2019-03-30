pragma solidity ^0.5.2;

import "./interfaces/IOwnableERC223.sol";

contract Install {
    mapping(bool => IOwnableERC223) token;
    // IOwnableERC223 internal wnty;
    // IOwnableERC223 internal nusd;

    constructor ()
        public
    {

    }

    function wntyRegister()
        internal
    {
        // SellType false
        require(address(token[false]) == address(0), "already set");
        token[false] = IOwnableERC223(msg.sender);
    }

    function nusdRegister()
        internal
    {
        // BuyType true
        require(address(token[true]) == address(0), "already set");
        token[true] = IOwnableERC223(msg.sender);
    }
}