pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
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
        books[false].orders[bytes32(0)] = order;  
        books[true].orders[bytes32(0)] = order;       
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
    // bytes _data = uint256[2] = (wantAmount, assistingID)
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
        bytes32 assistingID;
        (wantAmount, assistingID) = abi.decode(_data, (uint256, bytes32));
        bytes32 _orderID = insert(
            orderType,
            haveAmount,
            wantAmount,
            maker,
            assistingID
        );
        pairing(orderType, _orderID);
    }

    function pairing(
        bool _orderType,
        bytes32 _orderID
    )
        private
    {
        bool _redroType = !_orderType;
        OrderList storage orderBook = books[_orderType];
        Order storage _order = orderBook.orders[_orderID];
        OrderList storage redroBook = books[_redroType];
        bytes32 _redroTopId = top(_redroType);

        while (_redroTopId[0] != 0) {
            Order storage _redro = redroBook.orders[_redroTopId];
            if (_order.haveAmount.mul(_redro.haveAmount) < _order.wantAmount.mul(_redro.wantAmount)) {
                // not pairable
                return;
            }
            uint256 orderPairableAmount = getMin(_order.haveAmount, _redro.wantAmount);
            // pairable price = _redro.haveAmount / _redro.wantAmount
            _order.wantAmount = _order.wantAmount * (_order.haveAmount - orderPairableAmount) / _order.haveAmount;
            _order.haveAmount = _order.haveAmount.sub(orderPairableAmount);

            uint256 redroPairableAmount = _redro.haveAmount * orderPairableAmount / _redro.wantAmount;
            _redro.wantAmount = _redro.wantAmount * (_redro.haveAmount - redroPairableAmount) / _redro.haveAmount;
            _redro.haveAmount = _redro.haveAmount.sub(redroPairableAmount);

            token[_redroType].transfer(_order.maker, redroPairableAmount);
            token[_orderType].transfer(_redro.maker, orderPairableAmount);
            if (_redro.haveAmount == 0 || _redro.wantAmount == 0) {
                _remove(_redroType, _redroTopId);
            }
            _redroTopId = top(_redroType);
            if (_order.haveAmount == 0 || _order.wantAmount == 0) {
                _remove(_orderType, _orderID);
                return;
            }
        }
        return;
    }

}