pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./ERC223.sol";
import "../interfaces/IPairEx.sol";

/*
    ...
*/

contract StableToken is ERC223{
    string public constant name = "Nexty USD";
    string public constant symbol = "NUSD";
    uint8 public constant decimals = 6;

    IPairEx internal orderbook;

    constructor (
        address _orderbook
    )
        public
    {
        _mint(msg.sender, 10**12);
        if (_orderbook == address(0)) return;
        initialize(address(_orderbook));
    }

    function setup(
        address _orderbook
    )
        external
    {
        orderbook = IPairEx(_orderbook);
        initialize(_orderbook);
    }

    function simpleBuy(
        uint256  _value,
        uint256 _wantAmount,
        bytes32 _assistingID
    )
        public
        payable
    {
        bytes memory data = abi.encode(_wantAmount, _assistingID);
        transfer(owner(), _value, data);
    }
}