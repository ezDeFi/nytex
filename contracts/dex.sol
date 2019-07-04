pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/math/Math.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./interfaces/IOwnableERC223.sol";

library dex {
    using SafeMath for uint256;

    bytes32 constant ZERO_ID = bytes32(0);
    address constant ZERO_ADDRESS = address(0x0);
    uint256 constant INPUTS_MAX = 2 ** 127;

    function zeroID() internal pure returns (bytes32) {
        return ZERO_ID;
    }

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
    using dex for Order;

    function isValid(
        Order storage _order
    )
        internal
        view
        returns(bool)
    {
        // including meta order (null, 0, 1)
        return _order.wantAmount > 0;
    }

    function getID(
        Order storage _order
    )
        internal
        view
        returns(bytes32)
    {
        return calcID(_order.maker, _order.haveAmount, _order.wantAmount);
    }

    function betterThan(
        Order storage order,
        Order storage redro
    )
        internal
        view
        returns (bool)
    {
        uint256 a = order.haveAmount.mul(redro.wantAmount);
        uint256 b = redro.haveAmount.mul(order.wantAmount);
        return a > b;
    }

    // memory version of betterThan
    function m_betterThan(
        Order memory order,
        Order storage redro
    )
        internal
        view
        returns (bool)
    {
        uint256 a = order.haveAmount.mul(redro.wantAmount);
        uint256 b = redro.haveAmount.mul(order.wantAmount);
        return a > b;
    }


    struct Book {
        IOwnableERC223 haveToken;
        IOwnableERC223 wantToken;
        mapping (bytes32 => Order) orders;
        // bytes32 top;	// the highest priority (lowest sell or highest buy)
        // bytes32 bottom;	// the lowest priority (highest sell or lowest buy)
    }
    using dex for Book;

    function init(
        Book storage book,
        IOwnableERC223 haveToken,
        IOwnableERC223 wantToken
    )
        internal
    {
        book.haveToken = haveToken;
        book.wantToken = wantToken;
        book.orders[dex.ZERO_ID].wantAmount = 1;
    }

    // get the order token amount, it can be either have or want amount
    function getTokenAmount(
        Book storage book,
        Order storage order,
        IOwnableERC223 token
    )
        internal
        view
        returns (uint256)
    {
        if (token == book.haveToken) {
            return order.haveAmount;
        }
        if (token == book.wantToken) {
            return order.wantAmount;
        }
        return 0;
    }

    // read functions
    function topID(
        Book storage book
    )
        internal
        view
        returns (bytes32)
    {
        return book.orders[ZERO_ID].next;
    }

    function bottomID(
        Book storage book
    )
        internal
        view
        returns (bytes32)
    {
        return book.orders[ZERO_ID].prev;
    }

    function createOrder(
        Book storage book,
        address _maker,
        uint256 _haveAmount,
        uint256 _wantAmount
    )
        internal
        returns (bytes32)
    {
        // TODO move require check to API
        require(_haveAmount > 0 && _wantAmount > 0, "save your time");
        require((_haveAmount < INPUTS_MAX) && (_wantAmount < INPUTS_MAX), "greater than supply?");
        bytes32 id = calcID(_maker, _haveAmount, _wantAmount);
        book.orders[id] = Order(_maker, _haveAmount, _wantAmount, 0, 0);
        return id;
    }

    function getOrder(
        Book storage book,
        bytes32 id
    )
        internal
        view
        returns (Order storage)
    {
        return book.orders[id];
    }

    // inseter _id as prev element of _next
    function insertBefore(
        Book storage book,
        bytes32 id,
        bytes32 next
    )
        internal
    {
        // prev => [id] => next
        bytes32 prev = book.orders[next].prev;
        book.orders[id].prev = prev;
        book.orders[id].next = next;
        book.orders[next].prev = id;
        book.orders[prev].next = id;
    }

    // find the next id (position) to insertBefore
    function find(
        Book storage book,
        Order storage newOrder,
        bytes32 assistingID
    )
        internal
        view
 	    returns (bytes32)
    {
        bytes32 id = book.topID(); // TODO: should this be assistingID?
        Order storage order = book.getOrder(id);
        // if the list is not empty and new order is not better than the top,
        // search for the correct order
        if (!newOrder.betterThan(order)) {
            order = book.getOrder(id = assistingID); // should this be outside
            // top <- bottom: while (newID > id)
            while (newOrder.betterThan(order)) {
                order = book.getOrder(id = order.prev);
            }
            order = book.getOrder(id = order.next);
            // top -> bottom: while (id >= newID)
            while (!newOrder.betterThan(order)) {
                order = book.getOrder(id = book.orders[id].next);
            }
        }
        return id;
    }

    // memory version of find
    function m_find(
        Book storage book,
        Order memory newOrder,
        bytes32 assistingID
    )
        internal
        view
 	    returns (bytes32)
    {
        bytes32 id = assistingID == ZERO_ID ? book.topID() : assistingID;
        Order storage order = book.getOrder(id);
        // if the list is not empty and new order is not better than the top,
        // search for the correct order
        if (!newOrder.m_betterThan(order)) {
            order = book.getOrder(id = assistingID); // should this be outside
            // top <- bottom: while (newID > id)
            while (newOrder.m_betterThan(order)) {
                order = book.getOrder(id = order.prev);
            }
            order = book.getOrder(id = order.next);
            // top -> bottom: while (id >= newID)
            while (!newOrder.m_betterThan(order)) {
                order = book.getOrder(id = book.orders[id].next);
            }
        }
        return id;
    }

    // place the new order into its correct position
    function place(
        Book storage book,
        bytes32 newID,
        bytes32 assistingID
    )
        internal
 	    returns (bytes32)
    {
        Order storage newOrder = book.getOrder(newID);
        bytes32 id = book.find(newOrder, assistingID);
        book.insertBefore(newID, id);
        return id;
    }

    // NOTE: this function does not payout nor refund
    // Use payout/refund/fill instead
    function _remove(
        Book storage book,
        bytes32 id
    )
        internal
    {
        Order storage order = book.orders[id];
        // before: prev => order => next
        // after:  prev ==========> next
        book.orders[order.prev].next = order.next;
        book.orders[order.next].prev = order.prev;
        delete book.orders[id];
    }

    function payout(
        Book storage book,
        bytes32 id
    )
        internal
    {
        book.wantToken.transfer(book.orders[id].maker, book.orders[id].wantAmount);
        book._remove(id);
    }

    function refund(
        Book storage book,
        bytes32 id
    )
        internal
    {
        book.haveToken.transfer(book.orders[id].maker, book.orders[id].haveAmount);
        book._remove(id);
    }

    function payoutPartial(
        Book storage book,
        Order storage order,
        uint256 fillableHave,
        uint256 fillableWant
    )
        internal
    {
        book.wantToken.transfer(order.maker, fillableWant);
        order.haveAmount = order.haveAmount.sub(fillableHave);
        order.wantAmount = order.wantAmount.sub(fillableWant);
        // TODO: emit event for 'partial order filled'
        if (order.haveAmount == 0 || order.wantAmount == 0) {
            book.refund(order.getID());
            // TODO: emit event for 'remain order rejected'
        }
    }

    function fill(
        Book storage orderBook,
        bytes32 orderID,
        Book storage redroBook
    )
        internal
    {
        Order storage order = orderBook.getOrder(orderID);
        bytes32 redroTopID = redroBook.topID();

        while (redroTopID != ZERO_ID) {
            Order storage redro = redroBook.getOrder(redroTopID);
            if (order.haveAmount.mul(redro.haveAmount) < order.wantAmount.mul(redro.wantAmount)) {
                // not pairable
                return;
            }
            uint256 orderPairableAmount = Math.min(order.haveAmount, redro.wantAmount);
            order.wantAmount = order.wantAmount.mul(order.haveAmount.sub(orderPairableAmount)).div(order.haveAmount);
            order.haveAmount = order.haveAmount.sub(orderPairableAmount);

            uint256 redroPairableAmount = redro.haveAmount.mul(orderPairableAmount).div(redro.wantAmount);
            redro.wantAmount = redro.wantAmount.mul(redro.haveAmount.sub(redroPairableAmount)).div(redro.haveAmount);
            redro.haveAmount = redro.haveAmount.sub(redroPairableAmount);

            orderBook.wantToken.transfer(order.maker, redroPairableAmount);
            redroBook.wantToken.transfer(redro.maker, orderPairableAmount);
            if (redro.haveAmount == 0 || redro.wantAmount == 0) {
                redroBook.refund(redroTopID);
            }
            redroTopID = redroBook.topID();
            if (order.haveAmount == 0 || order.wantAmount == 0) {
                orderBook.refund(orderID);
                return;
            }
        }
        return;
    }

    function absorb(
        Book storage book,
        IOwnableERC223 token,
        uint256 target
    )
        internal
        returns(uint256 totalTMA, uint256 totalAMT)
    {
        bytes32 id = book.topID();
        while(id != ZERO_ID && totalAMT < target) {
            dex.Order storage order = book.getOrder(id);
            uint256 amt = (book.haveToken == token) ? order.haveAmount : order.wantAmount;
            uint256 tma = (book.haveToken == token) ? order.wantAmount : order.haveAmount;
            if (totalAMT.add(amt) <= target) {
                // fill the order
                book.haveToken.dexBurn(order.haveAmount);
                book.wantToken.dexMint(order.wantAmount);
                // bytes32 cursorToPayout = cursor;
                // cursor = order.next;
                // book.payout(cursorToPayout);
                book.payout(id);
                id = order.next;
                // TODO: emit event for 'full order filled'
            } else {
                // partial order fill
                uint256 fillableAMT = target.sub(totalAMT);
                tma = tma.mul(fillableAMT).div(amt);
                amt = fillableAMT;
                uint256 fillableHave = (book.haveToken == token) ? amt : tma;
                uint256 fillableWant = (book.wantToken == token) ? amt : tma;
                // fill the partial order
                book.haveToken.dexBurn(fillableHave);
                book.wantToken.dexMint(fillableWant);
                book.payoutPartial(order, fillableHave, fillableWant);
                // extra step to make sure the loop will stop after this
                id = ZERO_ID;
            }
            totalAMT = totalAMT.add(amt);
            totalTMA = totalTMA.add(tma);
        }
        // not enough order, return all we have
        return (totalTMA, totalAMT);
    }
}
