pragma solidity ^0.5.2;

import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./DataSet.sol";
import "./Install.sol";

contract OrderBook is Install, DataSet {
    using SafeMath for uint256;
    bytes32 public debug ;
    function insert(
        bool _orderType,
        uint256 _fromAmount,
        uint256 _toAmount,
        address _maker,
        bytes32 _checkpoint
        ) 
        public
 	    returns (bytes32) 
    {
        require(validOrder(_orderType, _checkpoint), "save your gas");
        OrderList storage book = books[_orderType];
        bytes32 id = initOrder(_maker, _orderType, _fromAmount, _toAmount);

        // direction to bottom, search first order, that new order better than
        bytes32 cursor = _checkpoint;
        if (!betterBid(_orderType, id, cursor)) {
            // order[id] always better than oder[0] with price = 0
            // if price of order[id] = 0 => throw cause infinite loop
            while (!betterBid(_orderType, id, cursor)) {
                cursor = book.orders[cursor].next;
            }
            prevInsert(_orderType, id, cursor);
            return id;
        }
        cursor = book.orders[cursor].prev;
        // direction to top, search first order that new order not better than
        // this part triggered only if new order not better than checkpoint order
        while (cursor[0] != 0 && betterBid(_orderType, id, cursor)) {
            cursor = book.orders[cursor].prev;
        }
        prevInsert(_orderType, id, book.orders[cursor].next);
        return id;
    }

    // inseter _id as prev element of _next
    function prevInsert(
        bool _orderType,
        bytes32 _id,
        bytes32 _next
    )
        private
    {
        // _prev => _id => _next
        OrderList storage book = books[_orderType];
        bytes32 _prev = book.orders[_next].prev;
        book.orders[_id].prev = _prev;
        book.orders[_id].next = _next;
        book.orders[_next].prev = _id;
        book.orders[_prev].next = _id;
    }

    function validOrder(
        bool _orderType,
        bytes32 _id
    )
        public
        view
        returns(bool)
    {
        OrderList storage book = books[_orderType];
        Order storage _order = book.orders[_id];
        return _order.toAmount > 0;
    }

    function initOrder(
        address _maker,
        bool _orderType,
        uint256 _fromAmount,
        uint256 _toAmount
    )
        public
        returns (bytes32)
    {
        require(_fromAmount > 0 && _toAmount > 0, "save your time");
        pNonce[_maker]++;
        OrderList storage book = books[_orderType];
        bytes32 id = sha256(abi.encodePacked(_maker, pNonce[_maker], _fromAmount, _toAmount));
        book.orders[id] = Order(_maker, _fromAmount, _toAmount, 0, 0);
        debug = id;
        return id;
    }

    function _remove(bool _orderType, bytes32 _id) internal {
        OrderList storage book = books[_orderType];
        Order storage order = book.orders[_id];
        // before: prev => order =>next
        // after: prev => next
        book.orders[order.prev].next = order.next;
        book.orders[order.next].prev = order.prev;
        token[_orderType].transfer(order.maker, order.fromAmount);
        delete book.orders[_id];
    }

    function remove(bool _orderType, bytes32 _id) public {
        OrderList storage book = books[_orderType];
        Order storage order = book.orders[_id];
        require(msg.sender == order.maker, "only order owner");
        // before: prev => order =>next
        // after: prev => next
        book.orders[order.prev].next = order.next;
        book.orders[order.next].prev = order.prev;
        token[_orderType].transfer(order.maker, order.fromAmount);
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
        Order storage _new = book.orders[_newId];
        Order storage _old = book.orders[_oldId];
        // newTo / newFrom < oldTo / oldFrom
        uint256 a = _new.fromAmount.mul(_old.toAmount);
        uint256 b = _old.fromAmount.mul(_new.toAmount);
        return a > b;
    }

    function getMin(
        uint a,
        uint b
    )
        public
        pure
        returns(uint)
    {
        return a > b ? b : a;
    }

    function getNext(
        bool _orderType,
        bytes32 _id
    )
        public
        view
        returns (bytes32)
    {
        OrderList storage book = books[_orderType];
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
        OrderList storage book = books[_orderType];
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
        OrderList storage book = books[_orderType];
        Order storage order = book.orders[_id];
        return (order.maker, order.fromAmount, order.toAmount, order.prev, order.next);
    }
}