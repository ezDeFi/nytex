pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/math/Math.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./OrderBook.sol";

contract PairEx is OrderBook {
    using orderlib for orderlib.Order;
    using orderlib for orderlib.Book;

    bytes32 constant ZERO_ID = bytes32(0);

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
        books[Ask].haveToken = StablizeToken;
        books[Ask].wantToken = VolatileToken;
        books[Bid].haveToken = StablizeToken;
        books[Bid].wantToken = VolatileToken;
        orderlib.Order memory order;
        order.wantAmount = 1;
        // Selling Book
        books[Ask].orders[ZERO_ID] = order;
        // Buying Book
        books[Bid].orders[ZERO_ID] = order;
    }

    function setup(
        address _volatileTokenAddress,
        address _stableTokenAddress
    )
        public
    {
        volatileTokenRegister(_volatileTokenAddress);
        stableTokenRegister(_stableTokenAddress);
        VolatileToken.setup(address(this));
        StablizeToken.setup(address(this));
    }

    function getOrderType()
        public
        view
        returns(bool)
    {
        address _sender = msg.sender;
        require(_sender == address(StablizeToken) || _sender == address(VolatileToken), "only VolatileToken and StableToken accepted");
        return _sender == address(StablizeToken);
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
        orderlib.Book storage book = books[orderType];
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
        orderlib.Book storage book = books[_orderType];
        uint256 totalSTB;
        uint256 totalVOL;
        bytes32 cursor = book.topID();
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
        bool inflate,
        uint256 stableTokenTarget
    )
        public
        returns(uint256 totalVOL, uint256 totalSTB)
    {
        require(msg.sender == address(this), "consensus only");
        bool orderType = inflate ? Ask : Bid; // inflate by filling NTY sell order
        orderlib.Book storage book = books[orderType];
        return book.absorb(StablizeToken, stableTokenTarget);
    }
}