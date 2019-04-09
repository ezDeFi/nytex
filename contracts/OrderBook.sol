pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./DataSet.sol";
import "./Initializer.sol";

contract OrderBook is Initializer, DataSet {
    using SafeMath for uint256;
    // Stepping price param
    // Define T as the half of the price percentage step
    // New orders with price fall between (1/(100+T))% and (100+T)% of an existing order, should belong to a same group/bucket.
    uint256 internal T = 1;

    function insert(
        bool _orderType,
        uint256 _haveAmount,
        uint256 _wantAmount,
        address _maker,
        bytes32 _assistingID
        ) 
        public
 	    returns (bytes32) 
    {
        require(validOrder(_orderType, _assistingID), "save your gas");
        OrderList storage book = books[_orderType];
        bytes32 newID = initOrder(_maker, _orderType, _haveAmount, _wantAmount);

        // direction to bottom, search first order, that new order better than
        bytes32 id = _assistingID;
        if (!betterOrder(_orderType, newID, id)) {
            // order[newID] always better than oder[0] with price = 0
            // if price of order[newID] = 0 => throw cause infinite loop
            while (!betterOrder(_orderType, newID, id)) {
                id = book.orders[id].next;
            }
            insertBefore(_orderType, newID, id);
            return newID;
        }
        id = book.orders[id].prev;
        // direction to top, search first order that new order not better than
        // this part triggered only if new order not better than assistingID order
        while (id[0] != 0 && betterOrder(_orderType, newID, id)) {
            id = book.orders[id].prev;
        }
        insertBefore(_orderType, newID, book.orders[id].next);
        return newID;
    }

    // inseter _id as prev element of _next
    function insertBefore(
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
        return _order.wantAmount > 0;
    }

    function initOrder(
        address _maker,
        bool _orderType,
        uint256 _haveAmount,
        uint256 _wantAmount
    )
        public
        returns (bytes32)
    {
        require(_haveAmount > 0 && _wantAmount > 0, "save your time");
        pNonce[_maker]++;
        OrderList storage book = books[_orderType];
        bytes32 id = sha256(abi.encodePacked(_maker, pNonce[_maker], _haveAmount, _wantAmount));
        book.orders[id] = Order(_maker, _haveAmount, _wantAmount, 0, 0);
        return id;
    }

    function _remove(bool _orderType, bytes32 _id) internal {
        OrderList storage book = books[_orderType];
        Order storage order = book.orders[_id];
        // before: prev => order =>next
        // after: prev => next
        book.orders[order.prev].next = order.next;
        book.orders[order.next].prev = order.prev;
        token[_orderType].transfer(order.maker, order.haveAmount);
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
        token[_orderType].transfer(order.maker, order.haveAmount);
        delete book.orders[_id];
    }

    function _setT(uint256 _T) private {
        T = _T;
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

    function betterOrder(
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
        // stepping price
        // newWant / newHave < (oldWant / oldHave) * (100 / (100 + T))
        uint256 a = _new.haveAmount.mul(_old.wantAmount).mul(100);
        uint256 b = _old.haveAmount.mul(_new.wantAmount).mul(100 + T);
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
        return (order.maker, order.haveAmount, order.wantAmount, order.prev, order.next);
    }
}