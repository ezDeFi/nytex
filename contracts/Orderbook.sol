pragma solidity ^0.5.2;

import "./lib/dex.sol";
import "./Initializer.sol";

/**
 * Contract code for Volatile/Stablize exchange
 */
contract Orderbook is Initializer {
    using dex for dex.Order;
    using dex for dex.Book;

    // TODO: mapping (hash(haveTokenAddres,wantTokenAddress) => dex.Book)
    mapping(bool => dex.Book) internal books;

    constructor (
        address volatileTokenAddress,
        address stablizeTokenAddress
    )
        public
    {
        if (volatileTokenAddress != address(0)) {
            volatileTokenRegister(volatileTokenAddress);
        }
        if (stablizeTokenAddress != address(0)) {
            stablizeTokenRegister(stablizeTokenAddress);
        }
        books[Ask].init(VolatileToken, StablizeToken);
        books[Bid].init(StablizeToken, VolatileToken);
    }

    function registerTokens(
        address _volatileTokenAddress,
        address _stablizeTokenAddress
    )
        external
    {
        volatileTokenRegister(_volatileTokenAddress);
        stablizeTokenRegister(_stablizeTokenAddress);
        books[Ask].init(VolatileToken, StablizeToken);
        books[Bid].init(StablizeToken, VolatileToken);
    }

    function trade(
        address maker,
        uint haveAmount,
        uint wantAmount,
        bytes32 assistingID
    )
        internal
    {
        // TODO: get order type from ripem160(haveToken)[:16] + ripem160(wantToken)[:16]
        dex.Book storage book = bookHave(msg.sender);

        bytes32 newID = book.createOrder(maker, haveAmount, wantAmount);
        if (newID == bytes32(0)) {
            // no new order
            return;
        }
        book.place(newID, assistingID);
        book.fill(newID, bookWant(msg.sender));
    }

    // iterator
    function top(
        bool orderType
    )
        public
        view
        returns (bytes32)
    {
        dex.Book storage book = books[orderType];
        return book.topID();
    }

    // iterator
    function next(
        bool orderType,
        bytes32 id
    )
        public
        view
        returns (bytes32)
    {
        dex.Book storage book = books[orderType];
        return book.orders[id].next;
    }

    // iterator
    function prev(
        bool orderType,
        bytes32 id
    )
        public
        view
        returns (bytes32)
    {
        dex.Book storage book = books[orderType];
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
            uint,
            uint,
            bytes32,
            bytes32
        )
    {
        dex.Book storage book = books[_orderType];
        dex.Order storage order = book.orders[_id];
        return (order.maker, order.haveAmount, order.wantAmount, order.prev, order.next);
    }

    // find the next assisting id for an order
    function findAssistingID(
        bool orderType,
        address maker,
        uint haveAmount,
        uint wantAmount,
        bytes32 assistingID
    )
        public
        view
 	    returns (bytes32)
    {
        dex.Book storage book = books[orderType];
        dex.Order memory newOrder = dex.Order(
            maker,
            haveAmount,
            wantAmount,
            bytes32(0),
            bytes32(0));
        return book.m_find(newOrder, assistingID);
    }

    function bookHave(
        address haveToken
    )
        internal
        view
        returns(dex.Book storage)
    {
        if (haveToken == address(books[false].haveToken)) {
            return books[false];
        }
        if (haveToken == address(books[true].haveToken)) {
            return books[true];
        }
        revert("no order book for token");
    }

    function bookWant(
        address wantToken
    )
        internal
        view
        returns(dex.Book storage)
    {
        if (wantToken == address(books[false].wantToken)) {
            return books[false];
        }
        if (wantToken == address(books[true].wantToken)) {
            return books[true];
        }
        revert("no order book for token");
    }

    // Cancel and refund the remaining order.haveAmount
    function cancel(bool _orderType, bytes32 _id) public {
        dex.Book storage book = books[_orderType];
        dex.Order storage order = book.orders[_id];
        require(msg.sender == order.maker, "only order maker");
        book.refund(_id);
    }
}