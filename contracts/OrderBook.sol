pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import {orderlib} from "./DataSet.sol";
import "./Initializer.sol";

contract OrderBook is Initializer {
    using SafeMath for uint256;
    using orderlib for orderlib.Order;
    using orderlib for orderlib.Book;

    // TODO: mapping (hash(haveTokenAddres,wantTokenAddress) => orderlib.Book)
    mapping(bool => orderlib.Book) internal books;

    // Cancel and refund the remaining order.haveAmount
    function cancel(bool _orderType, bytes32 _id) public {
        orderlib.Book storage book = books[_orderType];
        orderlib.Order storage order = book.orders[_id];
        require(msg.sender == order.maker, "only order owner");
        book.refund(_id);
    }

    function top(
        bool orderType
    )
        public
        view
        returns (bytes32)
    {
        orderlib.Book storage book = books[orderType];
        return book.topID();
    }

    function next(
        bool orderType,
        bytes32 id
    )
        public
        view
        returns (bytes32)
    {
        orderlib.Book storage book = books[orderType];
        return book.orders[id].next;
    }

    function prev(
        bool orderType,
        bytes32 id
    )
        public
        view
        returns (bytes32)
    {
        orderlib.Book storage book = books[orderType];
        return book.orders[id].prev;
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
        orderlib.Book storage book = books[_orderType];
        orderlib.Order storage order = book.orders[_id];
        return (order.maker, order.haveAmount, order.wantAmount, order.prev, order.next);
    }
}