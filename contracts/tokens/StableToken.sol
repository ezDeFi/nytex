pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./ERC223.sol";
import "../interfaces/IPairEx.sol";

/*
    ...
*/

contract StableToken is ERC223{
    string public constant symbol = "NEWSD";
    string public constant name = "New Stable Dollar";
    uint public constant decimals = 6;

    IPairEx internal orderbook;

    constructor (
        address _orderbook,      // mandatory
        address _prefundAddress, // optional
        uint _prefundAmount   // optional
    )
        public
    {
        if (_prefundAmount > 0 ) {
            _mint(_prefundAddress, _prefundAmount * 10**decimals);
        }
        initialize(address(_orderbook));
    }

    function registerDex(
        address _orderbook
    )
        external
    {
        // just an interface check
        orderbook = IPairEx(_orderbook);
    }

    // order USD -> MNTY
    function trade(
        uint _haveAmount,
        uint _wantAmount,
        bytes32 _assistingID
    )
        public
        payable
    {
        bytes memory data = abi.encode(_wantAmount, _assistingID);
        transfer(owner(), _haveAmount, data);
    }
}