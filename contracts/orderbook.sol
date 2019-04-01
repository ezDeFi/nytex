pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./Install.sol";
import "./Order.sol";
import "./lib/BytesConvert.sol";
import "./lib/ABI.sol";

contract Orderbook is Install, Order {
    using BytesConvert for *;
    using ABI for *;
    // uint256 constant MAX = 2**127;

    constructor () 
        public
    {
        Order memory order;
        order.toAmount = 1;
        OrderList storage book = books[false];
        book.orders[bytes32(0)] = order;  
        book = books[true]; 
        book.orders[bytes32(0)] = order;       
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

    // Token transfer's fallback
    // bytes _data = uint256[2] = (toAmount, checkpoint)
    // RULE : delegateCall never used
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
        (toAmount, checkpoint) = abi.decode(_data, (uint256, bytes32));
        insert(
            orderType,
            fromAmount,
            toAmount,
            maker,
            checkpoint
        );
    }

}