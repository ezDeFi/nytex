pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/math/Math.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./interfaces/IOwnableERC223.sol";

library dex {
    using SafeMath for uint256;

    bytes32 constant ZERO_ID = bytes32(0x0);
    bytes32 constant LAST_ID = bytes32(0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF);
    address constant ZERO_ADDRESS = address(0x0);
    uint256 constant INPUTS_MAX = 2 ** 128;

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

    function exists(Order storage order) internal view returns(bool)
    {
        // including meta orders [0] and [FF..FF]
        return order.maker != ZERO_ADDRESS;
    }

    function isEmpty(Order storage order) internal view returns(bool)
    {
        return order.haveAmount == 0 || order.wantAmount == 0;
    }

    function betterThan(Order storage o, Order storage p)
        internal
        view
        returns (bool)
    {
        return o.haveAmount * p.wantAmount > p.haveAmount * o.wantAmount;
    }

    // memory version of betterThan
    function m_betterThan(Order memory o, Order storage p)
        internal
        view
        returns (bool)
    {
        return o.haveAmount * p.wantAmount > p.haveAmount * o.wantAmount;
    }

    function fillableBy(Order memory o, Order storage p)
        internal
        view
        returns (bool)
    {
        return o.haveAmount * p.haveAmount >= p.wantAmount * o.wantAmount;
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
        book.orders[ZERO_ID] = Order(address(this), 0, 0, ZERO_ID, LAST_ID); // [0] meta order
        book.orders[LAST_ID] = Order(address(this), 0, 1, ZERO_ID, LAST_ID); // worst order meta
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
        return book.orders[LAST_ID].prev;
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
        require(_haveAmount > 0 && _wantAmount > 0, "zero input");
        require(_haveAmount < INPUTS_MAX && _wantAmount < INPUTS_MAX, "input over limit");
        bytes32 id = calcID(_maker, _haveAmount, _wantAmount);
        Order storage order = book.orders[id];
        if (!order.exists()) {
            // create new order
            book.orders[id] = Order(_maker, _haveAmount, _wantAmount, 0, 0);
            return id;
        }
        require(order.maker == _maker, "hash collision");
        // duplicate orders, combine them into one
        order.haveAmount = order.haveAmount.add(_haveAmount);
        order.wantAmount = order.wantAmount.add(_wantAmount);
        require(order.haveAmount < INPUTS_MAX && order.wantAmount < INPUTS_MAX, "combined input over limit");
        // caller should take no further action
        return ZERO_ID;
    }

    // insert [id] as [prev].next
    function insertAfter(
        Book storage book,
        bytes32 id,
        bytes32 prev
    )
        internal
    {
        // prev => [id] => next
        bytes32 next = book.orders[prev].next;
        book.orders[id].prev = prev;
        book.orders[id].next = next;
        book.orders[next].prev = id;
        book.orders[prev].next = id;
    }

    // find the next id (position) to insertAfter
    function find(
        Book storage book,
        Order storage newOrder,
        bytes32 id // [id] => newOrder
    )
        internal
        view
 	    returns (bytes32)
    {
        // [junk] => [0] => order => [FF]
        Order storage order = book.orders[id];
        do {
            order = book.orders[id = order.next];
        } while(!newOrder.betterThan(order));

        // [0] <= order <= [FF]
        do {
            order = book.orders[id = order.prev];
        } while(newOrder.betterThan(order));

        return id;
    }

    // memory version of find
    function m_find(
        Book storage book,
        Order memory newOrder,
        bytes32 id // [id] => newOrder
    )
        internal
        view
 	    returns (bytes32)
    {
        // [junk] => [0] => order => [FF]
        Order storage order = book.orders[id];
        do {
            order = book.orders[id = order.next];
        } while(!newOrder.m_betterThan(order));

        // [0] <= order <= [FF]
        do {
            order = book.orders[id = order.prev];
        } while(newOrder.m_betterThan(order));

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
        Order storage newOrder = book.orders[newID];
        bytes32 id = book.find(newOrder, assistingID);
        book.insertAfter(newID, id);
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
        // TODO: handle order outside of the book, where next or prev is nil
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
        if (book.orders[id].wantAmount > 0) {
            book.wantToken.transfer(book.orders[id].maker, book.orders[id].wantAmount);
        }
        book._remove(id);
    }

    function refund(
        Book storage book,
        bytes32 id
    )
        internal
    {
        if (book.orders[id].haveAmount > 0) {
            book.haveToken.transfer(book.orders[id].maker, book.orders[id].haveAmount);
        }
        book._remove(id);
    }

    function payoutPartial(
        Book storage book,
        bytes32 id,
        uint256 fillableHave,
        uint256 fillableWant
    )
        internal
    {
        Order storage order = book.orders[id];
        require(order.exists(), "order not exist");
        require(fillableHave <= order.haveAmount, "fill more than have amount");
        order.haveAmount = order.haveAmount.sub(fillableHave);
        if (fillableWant < order.wantAmount) {
            // no need for SafeMath here
            order.wantAmount -= fillableWant;
        } else {
            // possibly profit from price diffirent
            order.wantAmount = 0;
        }
        book.wantToken.transfer(order.maker, fillableWant);
        // TODO: emit event for 'partial order filled'
        if (order.isEmpty()) {
            book.refund(id);
            // TODO: emit event for 'remain order rejected'
        }
    }

    function fill(
        Book storage orderBook,
        bytes32 orderID,
        Book storage redroBook
    )
        internal
        returns (bytes32 nextID)
    {
        Order storage order = orderBook.orders[orderID];
        bytes32 redroID = redroBook.topID();

        while (redroID != LAST_ID) {
            if (order.isEmpty()) {
                break;
            }
            Order storage redro = redroBook.orders[redroID];
            if (!order.fillableBy(redro)) {
                break;
            }
            if (order.haveAmount < redro.wantAmount) {
                uint256 fillable = order.haveAmount * redro.haveAmount / redro.wantAmount;
                require(fillable <= redro.haveAmount, "fillable > have");
                // partially payout the redro and stop
                redroBook.payoutPartial(redroID, fillable, order.haveAmount);
                orderBook.payoutPartial(orderID, order.haveAmount, fillable);
                break;
            }
            // fully payout the redro
            orderBook.payoutPartial(orderID, redro.wantAmount, redro.haveAmount);
            bytes32 next = redro.next;
            redroBook.payout(redroID);
            redroID = next;
        }
        return redroID;
    }

    // absorb and duplicate the effect to initiator
    function absorbPreemptive(
        Book storage book,
        bool useHaveAmount,
        uint256 target,
        address payable initiator
    )
        internal
        returns (uint256 totalBMT, uint256 totalAMT)
    {
        (totalBMT, totalAMT) = book.absorb(useHaveAmount, target);
        (uint256 haveAMT, uint256 wantAMT) = useHaveAmount ? (totalAMT, totalBMT) : (totalBMT, totalAMT);
        // if (book.haveToken.allowance(initiator, address(this)) < haveAMT) {
        //     return (0, 0);
        // }
        book.haveToken.transferFrom(initiator, book.haveToken.dex(), haveAMT);
        book.haveToken.dexBurn(haveAMT);
        book.wantToken.dexMint(wantAMT);
        book.wantToken.transfer(initiator, wantAMT);
        return (totalBMT, totalAMT);
    }

    function absorb(
        Book storage book,
        bool useHaveAmount,
        uint256 target
    )
        internal
        returns(uint256 totalBMT, uint256 totalAMT)
    {
        bytes32 id = book.topID();
        while(id != LAST_ID && totalAMT < target) {
            dex.Order storage order = book.orders[id];
            uint256 amt = useHaveAmount ? order.haveAmount : order.wantAmount;
            uint256 bmt = useHaveAmount ? order.wantAmount : order.haveAmount;
            if (totalAMT.add(amt) <= target) {
                // fill the order
                book.haveToken.dexBurn(order.haveAmount);
                book.wantToken.dexMint(order.wantAmount);
                bytes32 next = order.next;
                book.payout(id);
                id = next;
                // TODO: emit event for 'full order filled'
            } else {
                // partial order fill
                uint256 fillableAMT = target.sub(totalAMT);
                bmt = bmt * fillableAMT / amt;
                amt = fillableAMT;
                uint256 fillableHave = useHaveAmount ? amt : bmt;
                uint256 fillableWant = useHaveAmount ? amt : bmt;
                // fill the partial order
                book.haveToken.dexBurn(fillableHave);
                book.wantToken.dexMint(fillableWant);
                book.payoutPartial(id, fillableHave, fillableWant);
                // extra step to make sure the loop will stop after this
                id = LAST_ID;
            }
            totalAMT = totalAMT.add(amt);
            totalBMT = totalBMT.add(bmt);
        }
        // not enough order, return all we have
        return (totalBMT, totalAMT);
    }
}
