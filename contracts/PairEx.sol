pragma solidity ^0.5.2;

import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./OrderBook.sol";
import "./lib/BytesConvert.sol";
import "./lib/ABI.sol";

contract PairEx is OrderBook {
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
        require(_sender == address(token[true]) || _sender == address(token[false]), "only VolatileToken and StableToken accepted");
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
        bytes32 _newId = insert(
            orderType,
            fromAmount,
            toAmount,
            maker,
            checkpoint
        );
        pairing(orderType, _newId);
    }

    function pairing(
        bool _orderType,
        bytes32 _newId
    )
        private
    {
        OrderList storage book = books[_orderType];
        Order storage _newOrder = book.orders[_newId];
        OrderList storage oppoBook = books[!_orderType];
        bytes32 _oppoTopId = top(!_orderType);
        while (_oppoTopId[0] != 0) {
            Order storage _oppoOrder = oppoBook.orders[_oppoTopId];
            // if not pairable, return
            if (_newOrder.fromAmount.mul(_oppoOrder.fromAmount) < _newOrder.toAmount.mul(_oppoOrder.toAmount)) return;
            // token type = newOrder have
            uint256 comfirmAmount_new = getMin(_newOrder.fromAmount, _oppoOrder.toAmount);
            // token type = oppoOrder have
            uint256 comfirmAmount_oppo = _oppoOrder.fromAmount * comfirmAmount_new / _oppoOrder.toAmount;
            // comfirm price = _oppoOrder.fromAmount / _oppoOrder.toAmount
            _newOrder.toAmount = _newOrder.toAmount * (_newOrder.fromAmount - comfirmAmount_new) / _newOrder.fromAmount;
            _newOrder.fromAmount = _newOrder.fromAmount.sub(comfirmAmount_new);

            _oppoOrder.toAmount = _oppoOrder.toAmount * (_oppoOrder.fromAmount - comfirmAmount_oppo) / _oppoOrder.fromAmount;
            _oppoOrder.fromAmount = _oppoOrder.fromAmount.sub(comfirmAmount_oppo);

            token[!_orderType].transfer(_newOrder.maker, comfirmAmount_oppo);
            token[_orderType].transfer(_oppoOrder.maker, comfirmAmount_new);
            if (_oppoOrder.fromAmount == 0 || _oppoOrder.toAmount == 0) _remove(!_orderType, _oppoTopId);
            _oppoTopId = top(!_orderType);
            if (_newOrder.fromAmount == 0 || _newOrder.toAmount == 0) {
                _remove(_orderType, _newId);
                return;
            }
        }
        return;
    }

}