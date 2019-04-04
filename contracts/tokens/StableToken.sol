pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./ERC223.sol";
import "../lib/BytesConvert.sol";
import "../interfaces/IPairEx.sol";

/*
    ...
*/

contract StableToken is ERC223{
    using BytesConvert for *;

    IPairEx internal orderbook;

    constructor (address _orderbook)
        public
    {
        orderbook = IPairEx(_orderbook);
        orderbook.stableTokenRegister();
        initialize(address(_orderbook));
        _mint(msg.sender, 1000000);
    }

    function simpleBuy(
        uint256  _value,
        uint256 _wantAmount,
        bytes32 _checkpoint
    ) 
        public 
        payable 
    {
        bytes memory data = abi.encode(_wantAmount, _checkpoint);
        transfer(owner(), _value, data);
    }
}