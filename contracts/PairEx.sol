pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/math/Math.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./Initializer.sol";
import "./dex.sol";

contract PairEx is Initializer {
    using dex for dex.Order;
    using dex for dex.Book;
    using SafeMath for uint256;

    // TODO: mapping (hash(haveTokenAddres,wantTokenAddress) => dex.Book)
    mapping(bool => dex.Book) internal books;

    constructor (
        address _volatileTokenAddress,
        address _stablizeTokenAddress
    )
        public
    {
        if (_volatileTokenAddress != address(0)) {
            volatileTokenRegister(_volatileTokenAddress);
        }
        if (_stablizeTokenAddress != address(0)) {
            stablizeTokenRegister(_stablizeTokenAddress);
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
        VolatileToken.registerDex(address(this));
        StablizeToken.registerDex(address(this));
        books[Ask].init(VolatileToken, StablizeToken);
        books[Bid].init(StablizeToken, VolatileToken);
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
            uint256,
            uint256,
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
        uint256 haveAmount,
        uint256 wantAmount,
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

    // Token transfer's fallback
    // bytes _data = uint256[2] = (wantAmount, assistingID)
    // RULE : delegateCall never used
    //
    // buy/sell order is created by sending token to this address,
    // with extra data = (wantAmount, assistingID)
    function tokenFallback(
        address _from,
        uint _value,
        bytes calldata _data)
        external
    {
        address maker = _from;
        uint256 haveAmount = _value;
        uint256 wantAmount;
        bytes32 assistingID;
        (wantAmount, assistingID) = _data.length == 32 ?
            (abi.decode(_data, (uint256)), bytes32(0)) :
            (abi.decode(_data, (uint256, bytes32)));

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

    // orderToFill(BuyType, 123) returns an SellType order to fill enough buying orders to burn as much as 123 StableToken.
    // orderToFill(SellType, 456) returns an BuyType order to fill enough selling orders to create as much as 456 StableToken.
    function orderToFill(
        bool _orderType,
        uint256 _stableTokenTarget
    )
        internal
        view
        returns(uint256, uint256)
    {
        dex.Book storage book = books[_orderType];
        uint256 totalSTB;
        uint256 totalVOL;
        bytes32 id = book.topID();
        while(id != bytes32(0) && totalSTB < _stableTokenTarget) {
            dex.Order storage order = book.orders[id];
            uint256 stb = _orderType ? order.haveAmount : order.wantAmount;
            uint256 vol = _orderType ? order.wantAmount : order.haveAmount;
            // break-point
            if (totalSTB.add(stb) > _stableTokenTarget) {
                uint256 remainSTB = _stableTokenTarget.sub(totalSTB);
                uint256 remainVOL = vol * remainSTB / stb;
                return (totalVOL.add(remainVOL), totalSTB.add(remainSTB));
            }
            totalVOL = totalVOL.add(vol);
            totalSTB = totalSTB.add(stb);
            id = order.next;
        }
        //  Not enough order, return all we have
        return (totalVOL, totalSTB);
    }

    function absorb(
        bool inflate,
        uint256 stableTokenTarget
    )
        public
        returns(uint256 totalVOL, uint256 totalSTB)
    {
        require(msg.sender == address(this), "consensus only");
        bool orderType = inflate ? Ask : Bid; // inflate by filling NTY sell order
        dex.Book storage book = books[orderType];
        return book.absorb(StablizeToken, stableTokenTarget);
    }
}