pragma solidity ^0.5.2;

import "./interfaces/IOwnableERC223.sol";

contract Install {
    IOwnableERC223 internal wnty;
    IOwnableERC223 internal nusd;

    constructor ()
        public
    {

    }

    function wntyRegister()
        internal
    {
        require(address(wnty) == address(0), "already set");
        wnty = IOwnableERC223(msg.sender);
    }

    function nusdRegister()
        internal
    {
        require(address(nusd) == address(0), "already set");
        nusd = IOwnableERC223(msg.sender);
    }
}