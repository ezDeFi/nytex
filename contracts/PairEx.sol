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
        order.wantAmount = 1;
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
    // bytes _data = uint256[2] = (wantAmount, checkpoint)
    // RULE : delegateCall never used
    function tokenFallback(
        address _from,
        uint _value,
        bytes calldata _data) 
        external
    {
        address maker = _from;
        bool orderType = getOrderType();
        uint256 haveAmount = _value;
        uint256 wantAmount;
        bytes32 checkpoint;
        (wantAmount, checkpoint) = abi.decode(_data, (uint256, bytes32));
        bytes32 _newId = insert(
            orderType,
            haveAmount,
            wantAmount,
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
            if (_newOrder.haveAmount.mul(_oppoOrder.haveAmount) < _newOrder.wantAmount.mul(_oppoOrder.wantAmount)) return;
            // token type = newOrder have
            uint256 comfirmAmount_new = getMin(_newOrder.haveAmount, _oppoOrder.wantAmount);
            // token type = oppoOrder have
            uint256 comfirmAmount_oppo = _oppoOrder.haveAmount * comfirmAmount_new / _oppoOrder.wantAmount;
            // comfirm price = _oppoOrder.haveAmount / _oppoOrder.wantAmount
            _newOrder.wantAmount = _newOrder.wantAmount * (_newOrder.haveAmount - comfirmAmount_new) / _newOrder.haveAmount;
            _newOrder.haveAmount = _newOrder.haveAmount.sub(comfirmAmount_new);

            _oppoOrder.wantAmount = _oppoOrder.wantAmount * (_oppoOrder.haveAmount - comfirmAmount_oppo) / _oppoOrder.haveAmount;
            _oppoOrder.haveAmount = _oppoOrder.haveAmount.sub(comfirmAmount_oppo);

            token[!_orderType].transfer(_newOrder.maker, comfirmAmount_oppo);
            token[_orderType].transfer(_oppoOrder.maker, comfirmAmount_new);
            if (_oppoOrder.haveAmount == 0 || _oppoOrder.wantAmount == 0) _remove(!_orderType, _oppoTopId);
            _oppoTopId = top(!_orderType);
            if (_newOrder.haveAmount == 0 || _newOrder.wantAmount == 0) {
                _remove(_orderType, _newId);
                return;
            }
        }
        return;
    }

}