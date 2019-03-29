pragma solidity ^0.5.5;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

interface MyERC223Token {
    function transfer(address to, uint256 value) external returns (bool);
    function ownerMint(uint256 _amount) external;
}

contract Orderbook {
    MyERC223Token public wnty;
    MyERC223Token public nusd;

    constructor () 
        public
    {
    }

    function wntyRegister()
        public
    {
        require(address(wnty) == address(0), "already set");
        wnty = MyERC223Token(msg.sender);
    }

    function nusdRegister()
        public
    {
        require(address(nusd) == address(0), "already set");
        nusd = MyERC223Token(msg.sender);
    }

    // Token transfer's fallback
    function tokenFallback(
        address _from,
        uint _value,
        bytes calldata _data) 
        external
    {

    }
}