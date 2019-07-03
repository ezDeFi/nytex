pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./interfaces/IOwnableERC223.sol";

library orderlib {
    address constant ZERO_ADDRESS = address(0x0);
    uint256 constant INPUTS_MAX = 2 ** 127;

    function calcID(
        address maker,
        uint256 haveAmount,
        uint256 wantAmount
    )
        internal
        pure
        returns (bytes32)
    {
        return sha256(abi.encodePacked(maker, haveAmount, wantAmount));
    }

    struct Order {
        address maker;
        uint256 haveAmount;
        uint256 wantAmount;

        // linked list
        bytes32 prev;
        bytes32 next;
    }
    using orderlib for Order;

    function isValid(
        Order storage _order
    )
        public
        view
        returns(bool)
    {
        return _order.maker != ZERO_ADDRESS && _order.haveAmount > 0 && _order.wantAmount > 0;
    }

    function getID(
        Order storage _order
    )
        public
        view
        returns(bytes32)
    {
        return calcID(_order.maker, _order.haveAmount, _order.wantAmount);
    }

    function betterThan(
        Order storage order,
        Order storage redro
    )
        public
        view
        returns (bool)
    {
        uint256 a = SafeMath.mul(order.haveAmount, redro.wantAmount);
        uint256 b = SafeMath.mul(redro.haveAmount, order.wantAmount);
        return a > b;
    }


    struct OrderList {
        IOwnableERC223 haveToken;
        IOwnableERC223 wantToken;
        mapping (bytes32 => Order) orders;
        // bytes32 top;	// the highest priority (lowest sell or highest buy)
        // bytes32 bottom;	// the lowest priority (highest sell or lowest buy)
    }
    using orderlib for OrderList;

    function createOrder(
        OrderList storage book,
        address _maker,
        uint256 _haveAmount,
        uint256 _wantAmount
    )
        public
        returns (bytes32)
    {
        // TODO move require check to API
        require(_haveAmount > 0 && _wantAmount > 0, "save your time");
        require((_haveAmount < INPUTS_MAX) && (_wantAmount < INPUTS_MAX), "greater than supply?");
        bytes32 id = calcID(_maker, _haveAmount, _wantAmount);
        book.orders[id] = orderlib.Order(_maker, _haveAmount, _wantAmount, 0, 0);
        return id;
    }

    function getOrder(
        OrderList storage book,
        bytes32 id
    )
        public
        view
        returns (Order storage)
    {
        return book.orders[id];
    }

    // inseter _id as prev element of _next
    function insertBefore(
        OrderList storage book,
        bytes32 id,
        bytes32 next
    )
        public
    {
        // prev => [id] => next
        bytes32 prev = book.orders[next].prev;
        book.orders[id].prev = prev;
        book.orders[id].next = next;
        book.orders[next].prev = id;
        book.orders[prev].next = id;
    }

    // NOTE: this function does not payout nor refund
    // Use payout/refund instead
    function _remove(
        OrderList storage book,
        bytes32 id
    )
        internal
    {
        orderlib.Order storage order = book.orders[id];
        // before: prev => order => next
        // after:  prev ==========> next
        book.orders[order.prev].next = order.next;
        book.orders[order.next].prev = order.prev;
        delete book.orders[id];
    }

    function payout(
        orderlib.OrderList storage book,
        bytes32 id
    )
        public
    {
        book.wantToken.transfer(book.orders[id].maker, book.orders[id].wantAmount);
        book._remove(id);
    }

    function refund(
        orderlib.OrderList storage book,
        bytes32 id
    )
        public
    {
        book.haveToken.transfer(book.orders[id].maker, book.orders[id].haveAmount);
        book._remove(id);
    }
}
