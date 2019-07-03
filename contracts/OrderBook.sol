pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import {orderlib} from "./DataSet.sol";
import "./Initializer.sol";

contract OrderBook is Initializer {
    using SafeMath for uint256;
    using orderlib for orderlib.Order;

    bytes32 constant ZERO_ID = bytes32(0);
    address constant ZERO_ADDRESS = address(0x0);
    // Stepping price param
    uint256 internal StepDividend = 0;
    uint256 internal StepDivisor = 1;

    mapping(bool => orderlib.OrderList) internal books;

    // Remove order and payout or refund
    function _remove(
        bool _orderType,
        bytes32 _id,
        bool payout
    )
        internal
        returns (bytes32)
    {
        orderlib.OrderList storage book = books[_orderType];
        orderlib.Order storage order = book.orders[_id];
        // before: prev => order => next
        // after:  prev ==========> next
        book.orders[order.prev].next = order.next;
        book.orders[order.next].prev = order.prev;
        if (payout) { // order is filled
            token[!_orderType].transfer(order.maker, order.wantAmount);
        } else { // order is refunded
            token[_orderType].transfer(order.maker, order.haveAmount);
        }
        bytes32 next = order.next;
        delete book.orders[_id];
        return next;
    }

    // Cancel and refund the remaining order.haveAmount
    function cancel(bool _orderType, bytes32 _id) public {
        orderlib.OrderList storage book = books[_orderType];
        orderlib.Order storage order = book.orders[_id];
        require(msg.sender == order.maker, "only order owner");
        _remove(_orderType, _id, false);
    }

    function _setStep(uint256 dividend, uint256 divisor) private {
        StepDividend = dividend;
        StepDivisor = divisor;
    }

    // read functions
    function top(
        bool _orderType
    )
        public
        view
        returns (bytes32)
    {
        orderlib.OrderList storage book = books[_orderType];
        return book.orders[ZERO_ID].next;
    }

    function bottom(
        bool _orderType
    )
        public
        view
        returns (bytes32)
    {
        orderlib.OrderList storage book = books[_orderType];
        return book.orders[ZERO_ID].prev;
    }

    function betterOrder(
        bool orderType,
        bytes32 _newId,
        bytes32 _oldId
    )
        public
        view
        returns (bool)
    {
        orderlib.OrderList storage book = books[orderType];
        orderlib.Order storage _new = book.orders[_newId];
        orderlib.Order storage _old = book.orders[_oldId];
        // stepping price
        // newWant / newHave < (oldWant / oldHave) * (10000 / (10000 + T))
        // uint256 a = _new.haveAmount.mul(_old.wantAmount).div(StepDivisor + StepDividend);
        // uint256 b = _old.haveAmount.mul(_new.wantAmount).div(StepDivisor);
        uint256 a = _new.haveAmount.mul(_old.wantAmount).mul(StepDivisor);
        uint256 b = _old.haveAmount.mul(_new.wantAmount).mul(StepDivisor + StepDividend);
        return a > b;
    }

    function getNext(
        bool _orderType,
        bytes32 _id
    )
        public
        view
        returns (bytes32)
    {
        orderlib.OrderList storage book = books[_orderType];
        return book.orders[_id].next;
    }

    function getPrev(
        bool _orderType,
        bytes32 _id
    )
        public
        view
        returns (bytes32)
    {
        orderlib.OrderList storage book = books[_orderType];
        return book.orders[_id].prev;
    }

    function getOrder(
        bool _orderType,
        bytes32 _id
    )
        public
        view
        returns (
            address,
            uint256,
            uint256,
            bytes32,
            bytes32
        )
    {
        orderlib.OrderList storage book = books[_orderType];
        orderlib.Order storage order = book.orders[_id];
        return (order.maker, order.haveAmount, order.wantAmount, order.prev, order.next);
    }
}