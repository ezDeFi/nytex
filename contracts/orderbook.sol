pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./Install.sol";
import "./Order.sol";
import "./lib/BytesConvert.sol";

contract Orderbook is Install, Order {
    using BytesConvert for *;
    constructor () 
        public
    {
    }

    function getOrderType() 
        public
        view
        returns(bool)
    {
        address _sender = msg.sender;
        require(_sender == address(token[true]) || _sender == address(token[false]), "only WNTY and NUSD accepted");
        return _sender == address(token[true]);
    }

    function getData(
        uint256 _toAmount,
        bytes32 _checkpoint)
        public
        view
        returns (bytes memory)
    {
        return msg.data;
    }

    


    // Token transfer's fallback
    // bytes _data = uint256[2] = (toAmount, checkpoint)
    function tokenFallback(
        address _from,
        uint _value,
        bytes calldata _data) 
        external
    {
        address maker = _from;
        bool orderType = getOrderType();
        uint256 fromAmount = _value;
        uint256 toAmount;
        bytes32 checkpoint;
        (toAmount, checkpoint) = decode(_data);
    }

    function decode(
        bytes memory _data
    )
        public
        pure
        returns(uint256, bytes32)
    {
        require(_data.length == 64, "invalid data");
        return abi.decode(_data, (uint256, bytes32));
    }

    function encode(
        uint256 toAmount,
        bytes32 checkpoint
    )
        public
        pure
        returns(bytes memory)
    {
        return abi.encode(toAmount, checkpoint);
    }
}