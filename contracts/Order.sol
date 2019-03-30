pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./DataSet.sol";

contract Order is DataSet {
    using SafeMath for uint256;

    function insert(
        bool _orderType,
        uint256 _fromAmount,
        uint256 _toAmount,
        address payable _maker,
        bytes32 _checkpoint
        ) 
        private
 	    returns (bytes32) 
    {
        OrderList storage book = books[_orderType];
        // prev = 0, next = 0
        bytes32 id = initOrder(_maker, _orderType, _fromAmount, _toAmount);

        // direction to bottom, search first order, that new order better than
        bytes32 cursor = _checkpoint;
        while (cursor[0]!=0 && !betterBid(_orderType, id, cursor)) {
            cursor = book.orders[cursor].next;
        }
        if (cursor != _checkpoint) {
            book.orders[id].next = cursor;
            book.orders[id].prev = book.orders[cursor].prev;
            book.orders[cursor].prev = id;
            return id;
        }

        // direction to top, search first order that new order not better than
        // this part triggered only if new order not better than checkpoint order
        while (cursor[0]!=0 && betterBid(_orderType, id, cursor)) {
            cursor = book.orders[cursor].prev;
        }
        book.orders[id].prev = cursor;
        book.orders[id].next = book.orders[cursor].next;
        book.orders[cursor].next = id;
        return id;
    }

    function initOrder(
        address _maker,
        bool _orderType,
        uint256 _fromAmount,
        uint256 _toAmount
    )
        private
        returns (bytes32)
    {
        OrderList storage book = books[_orderType];
        bytes32 id = sha256(abi.encodePacked(_maker, _fromAmount, _toAmount));
        book.orders[id] = Order(_maker, _fromAmount, _toAmount, 0, 0);
    }

    function remove(bool _orderType, bytes32 _id) internal {
        OrderList storage book = books[_orderType];
        Order storage order = book.orders[_id];
        // before: prev => order =>next
        // after: prev => next
        book.orders[order.prev].next = order.next;
        book.orders[order.next].prev = order.prev;
        delete book.orders[_id];
    }

    // read functions
    function top(
        bool _orderType
    )
        public
        view
        returns (bytes32)
    {
        OrderList storage book = books[_orderType];
        return book.orders[bytes32(0)].next;
    }

    function bottom(
        bool _orderType
    )
        public
        view
        returns (bytes32)
    {
        OrderList storage book = books[_orderType];
        return book.orders[bytes32(0)].prev;
    }

    function betterBid(
        bool orderType,
        bytes32 _newId,
        bytes32 _oldId
    )
        public
        view
        returns (bool)
    {
        OrderList storage book = books[orderType];
        Order memory _new = book.orders[_newId];
        Order memory _old = book.orders[_oldId];
        uint256 a = _new.fromAmount.mul(_old.toAmount);
        uint256 b = _old.fromAmount.mul(_new.toAmount);
        return a > b;
    }

    function pairable(
        bool _direction,
        bytes32 _newId,
        bytes32 _oldId
    )
        public
        pure
        returns (bool)
    {
        return true;
    }
}