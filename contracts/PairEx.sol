pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/math/Math.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./OrderBook.sol";

contract PairEx is OrderBook {
    using orderlib for orderlib.Order;
    using orderlib for orderlib.OrderList;

    constructor (
        address _volatileTokenAddress,
        address _stableTokenAddress
    )
        public
    {
        if (_volatileTokenAddress != address(0)) {
            volatileTokenRegister(_volatileTokenAddress);
        }
        if (_stableTokenAddress != address(0)) {
            stableTokenRegister(_stableTokenAddress);
        }
        initBooks();
    }

    function initBooks()
        private
    {
        books[Sell].haveToken = token[Stable];
        books[Sell].wantToken = token[Volatile];
        books[Buy].haveToken = token[Stable];
        books[Buy].wantToken = token[Volatile];
        orderlib.Order memory order;
        order.wantAmount = 1;
        // Selling Book
        books[Sell].orders[ZERO_ID] = order;
        // Buying Book
        books[Buy].orders[ZERO_ID] = order;
    }

    function setup(
        address _volatileTokenAddress,
        address _stableTokenAddress
    )
        public
    {
        volatileTokenRegister(_volatileTokenAddress);
        stableTokenRegister(_stableTokenAddress);
        token[Volatile].setup(address(this));
        token[Stable].setup(address(this));
    }

    function getOrderType()
        public
        view
        returns(bool)
    {
        address _sender = msg.sender;
        require(_sender == address(token[Stable]) || _sender == address(token[Volatile]), "only VolatileToken and StableToken accepted");
        return _sender == address(token[Stable]);
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
            (abi.decode(_data, (uint256)), ZERO_ID) :
            (abi.decode(_data, (uint256, bytes32)));

        // TODO: get order type from ripem160(haveToken)[:16] + ripem160(wantToken)[:16]
        bool orderType = getOrderType();
        orderlib.OrderList storage book = books[orderType];
        require(book.getOrder(assistingID).isValid(), "assisting ID not exist");

        bytes32 newID = book.createOrder(maker, haveAmount, wantAmount);
        book.place(newID, assistingID);
        book.fill(newID, books[!orderType]);
    }

    // orderToFill(BuyType, 123) returns an SellType order to fill enough buying orders to burn as much as 123 StableToken.
    // orderToFill(SellType, 456) returns an BuyType order to fill enough selling orders to create as much as 456 StableToken.
    function orderToFill(
        bool _orderType,
        uint256 _stableTokenTarget
    )
        public
        view
        returns(uint256, uint256)
    {
        orderlib.OrderList storage book = books[_orderType];
        uint256 totalSTB;
        uint256 totalVOL;
        bytes32 cursor = top(_orderType);
        while(cursor != ZERO_ID && totalSTB < _stableTokenTarget) {
            orderlib.Order storage order = book.orders[cursor];
            uint256 stb = _orderType ? order.haveAmount : order.wantAmount;
            uint256 vol = _orderType ? order.wantAmount : order.haveAmount;
            // break-point
            if (totalSTB.add(stb) > _stableTokenTarget) {
                uint256 remainSTB = _stableTokenTarget.sub(totalSTB);
                uint256 remainVOL = vol.mul(remainSTB).div(stb);
                return (totalVOL.add(remainVOL), totalSTB.add(remainSTB));
            }
            totalVOL = totalVOL.add(vol);
            totalSTB = totalSTB.add(stb);
            cursor = order.next;
        }
        //  Not enough order, return all we have
        return (totalVOL, totalSTB);
    }

    function absorb(
        bool _inflate,
        uint256 _stableTokenTarget
    )
        public
        returns(uint256, uint256)
    {
        require(msg.sender == address(this), "consensus only");
        bool orderType = _inflate ? Sell : Buy; // inflate by filling NTY sell order
        orderlib.OrderList storage book = books[orderType];
        uint256 totalVOL;
        uint256 totalSTB;
        bytes32 cursor = top(orderType);
        while(cursor != ZERO_ID && totalSTB < _stableTokenTarget) {
            orderlib.Order storage order = book.orders[cursor];
            uint256 vol = _inflate ? order.haveAmount : order.wantAmount;
            uint256 stb = _inflate ? order.wantAmount : order.haveAmount;
            if (totalSTB.add(stb) <= _stableTokenTarget) {
                totalVOL = totalVOL.add(vol);
                totalSTB = totalSTB.add(stb);
                // fill the order
                token[!_inflate].burnFromOwner(order.haveAmount);
                token[_inflate].mintToOwner(order.wantAmount);
                bytes32 cursorToPayout = cursor;
                cursor = order.next;
                book.payout(cursorToPayout);
                // TODO: emit event for 'full order filled'
                continue;
            }
            // partial order fill
            uint256 fillableHave;
            uint256 fillableWant;
            {// temporary scope
            uint256 fillableSTB = _stableTokenTarget.sub(totalSTB);
            uint256 fillableVOL = vol.mul(fillableSTB).div(stb);
            totalVOL = totalVOL.add(fillableVOL);
            totalSTB = totalSTB.add(fillableSTB);
            fillableHave = _inflate ? fillableVOL : fillableSTB;
            fillableWant = _inflate ? fillableSTB : fillableVOL;
            }
            // fill the partial order
            token[!_inflate].burnFromOwner(fillableHave);
            token[_inflate].mintToOwner(fillableWant);
            token[_inflate].transfer(order.maker, fillableWant);
            // TODO: emit event for 'partial order filled'
            order.haveAmount = order.haveAmount.sub(fillableHave);
            order.wantAmount = order.wantAmount.sub(fillableWant);
            if (order.haveAmount == 0 || order.wantAmount == 0) {
                book.refund(cursor);
                // TODO: emit event for 'remain order rejected'
            }
            break; // stop the absorption
        }
        //  Not enough order, return all we have
        return (totalVOL, totalSTB);
    }
}