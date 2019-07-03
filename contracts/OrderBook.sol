pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import {orderlib} from "./DataSet.sol";
import "./Initializer.sol";

contract OrderBook is Initializer {
    using SafeMath for uint256;
    using orderlib for orderlib.Order;
    using orderlib for orderlib.OrderList;

    bytes32 constant ZERO_ID = bytes32(0);
    address constant ZERO_ADDRESS = address(0x0);
    // Stepping price param
    uint256 internal StepDividend = 0;
    uint256 internal StepDivisor = 1;

    // TODO: mapping (hash(haveTokenAddres,wantTokenAddress) => orderlib.OrderList)
    mapping(bool => orderlib.OrderList) internal books;

    // Cancel and refund the remaining order.haveAmount
    function cancel(bool _orderType, bytes32 _id) public {
        orderlib.OrderList storage book = books[_orderType];
        orderlib.Order storage order = book.orders[_id];
        require(msg.sender == order.maker, "only order owner");
        book.refund(_id);
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