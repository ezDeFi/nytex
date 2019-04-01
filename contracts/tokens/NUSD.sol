pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./ERC223.sol";
import "./../lib/BytesConvert.sol";
import "./../interfaces/IOrderbook.sol";

/*
    ...
*/

contract NUSD is ERC223{
    using BytesConvert for *;

    IOrderbook internal orderbook;

    constructor (address _orderbook)
        public
    {
        orderbook = IOrderbook(_orderbook);
        orderbook.nusdRegister();
        initialize(address(_orderbook));
        _mint(0x95e2fcBa1EB33dc4b8c6DCBfCC6352f0a253285d, 1000000);
    }

    function simpleBuy(
        uint256  _value,
        uint256 _toAmount,
        bytes32 _checkpoint
    ) 
        public 
        payable 
    {
        bytes memory data = abi.encode(_toAmount, _checkpoint);
        transfer(owner(), _value, data);
    }
}