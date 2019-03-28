pragma solidity ^0.5.2;

import "./Stablio.sol";
import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";

// TODO: support non-AON order
contract OrderBook is Stablio {

	using SafeMath for uint256;

	struct Order {
		uint256 eth; // in wei
		uint256 tkn;
		address payable maker;

		// linked list
		bytes32 prev;
		bytes32 next;
	}

	struct OrderList {
		mapping (bytes32 => Order) orders;
		bytes32 top;	// the highest priority (lowest sell or highest buy)
		bytes32 bottom;	// the lowest priority (highest sell or lowest buy)
	}

	bool constant SellType = false;
	bool constant BuyType = true;

	mapping(bool => OrderList) books;

	function remove(bool orderType, bytes32 orderHash) private {
		OrderList storage book = books[orderType];
		Order storage order = book.orders[orderHash];

		if (order.prev[0] == 0) {
			book.top = order.next;
		} else {
			book.orders[order.prev].next = order.next;
		}

		if (order.next[0] == 0) {
			book.bottom = order.prev;
		} else {
			book.orders[order.next].prev = order.prev;
		}

		delete book.orders[orderHash];
	}

	function insert(bool orderType, uint256 _eth, uint256 _tkn, address payable _maker, bytes32 index) private
	returns (bytes32) {
		OrderList storage book = books[orderType];
		if (index[0] == 0) {
			index = book.top;
		}

		// search down
		for (; index[0] != 0; index = book.orders[index].next) {
			Order storage order = book.orders[index];
			uint256 a = order.eth.mul(_tkn); // existing order price
			uint256 b = _eth.mul(order.tkn); // inserting order price

			// For geeks: ((orderType == BuyType) != (a > b)) && a != b
			if (orderType == SellType) {
				// stop on the first higher sell order
				if (a > b) {
					index = order.prev;
					break;
				}
			} else {
				// stop on the first lower buy order
				if (a < b) {
					index = order.prev;
					break;
				}
			}
		}

		// search up
		for (; index[0] != 0; index = book.orders[index].prev) {
			Order storage order = book.orders[index];
			uint256 a = order.eth.mul(_tkn); // existing order price
			uint256 b = _eth.mul(order.tkn); // inserting order price

			if (orderType == SellType) {
				// stop on the first not-lower sell order
				if (a <= b) {
					index = order.prev;
					break;
				}
			} else {
				// stop on the first not-higher buy order
				if (a >= b) {
					index = order.prev;
					break;
				}
			}
		}

		// insert
		bytes32 prev = index;
		bytes32 next = index[0] == 0 ? book.top : book.orders[index].next;

		bytes32 id = sha256(abi.encodePacked(_eth, _tkn, _maker));
		book.orders[id] = Order(_eth, _tkn, _maker, prev, next);

		if (prev[0] == 0) {
			book.top = id;
		} else {
			book.orders[prev].next = id;
		}

		if (next[0] == 0) {
			book.bottom = id;
		} else {
			book.orders[next].prev = id;
		}

		return id;
    }

    // buyer (active) pays buyEtherWei / buyTokenWei  etherWei for 1 tokenWei
    // seller (passive) expects sellEtherWei / sellTokenWei etherWei for 1 tokenWei
    // buyable = paid price >= expected price
    // <=> buyEtherWei / buyTokenWei >= sellEtherWei / sellTokenWei
    // <=> buyEtherWei * sellTokenWei >= buyTokenWei * sellEtherWei
    // deal at price = sellEtherWei / sellTokenWei etherWei for 1 tokenWei
    function buyable(
        uint256 buyTokenWei,
        uint256 buyEtherWei,
        uint256 sellEtherWei,
        uint256 sellTokenWei
    )
        public
        view
        returns(bool)
    {
        return buyTokenWei.mul(sellEtherWei) <= sellTokenWei.mul(buyEtherWei);
    }

    function buyComfirm(
        address payable maker,
        uint256 buyTokenWei,
        uint256 buyEtherWei
    )
        private
        returns(
            uint256 restTokenWei,
            uint256 restEtherWei
        )
    {
        OrderList storage book = books[!BuyType];
        bytes32 index = book.top;
        Order storage order = book.orders[index];
        // buyer bought all => restTokenWei = 0, restEtherWei = 0
        if (order.tkn > buyTokenWei) {
            // comfirmed eth
            uint256 _ethTransfer = buyTokenWei.mul(order.eth) / order.tkn;
            maker.transfer(_ethTransfer);
            _transfer(address(this), order.maker, buyTokenWei);
            order.eth = order.eth.sub(_ethTransfer);
            order.tkn = order.tkn.sub(buyTokenWei);
            book.orders[index] = order;
            return (0, 0);
        } else {
        // top order filled all
            uint256 _ethTransfer = order.eth;
            maker.transfer(_ethTransfer);
            _transfer(address(this), order.maker, order.tkn);
            remove(SellType, index);
            uint256 _restBuyTokenWei = buyTokenWei.sub(order.tkn);
            // keep price of seller
            uint256 _restBuyEtherWei = buyEtherWei.mul(_restBuyTokenWei) / buyTokenWei;
            return (_restBuyTokenWei, _restBuyEtherWei);
        }
    }

    // buyer (passive) pays buyTokenWei / buyEtherWei tokenWei for 1 etherWei
    // seller (active) expects sellTokenWei / sellEtherWei  tokenWei for 1 etherWei
    // sellable = paid price >= expected price
    // <=> buyTokenWei / buyEtherWei >= sellTokenWei / sellEtherWei
    // <=> buyTokenWei * sellEtherWei >= sellTokenWei * buyEtherWei
    // deal at price = buyTokenWei / buyEtherWei tokenWei for 1 etherWei
    function sellable(
        // deposited ethm waiting to receive tokens
        uint256 sellEtherWei,
        uint256 sellTokenWei,
        // deposited tokens, waiting to receive eth
        uint256 buyTokenWei,
        uint256 buyEtherWei
    )
        public
        view
        returns(bool)
    {
        return buyTokenWei.mul(sellEtherWei) >= sellTokenWei.mul(buyEtherWei);
    }

    function sellComfirm(
        address payable maker,
        uint256 sellEtherWei,
        uint256 sellTokenWei
    )
        private
        returns(
            uint256 restEtherWei,
            uint256 restTokenWei
        )
    {
        OrderList storage book = books[!SellType];
        bytes32 index = book.top;
        Order storage order = book.orders[index];
        // seller sold all => restEtherWei = 0, restTokenWei = 0
        if (order.eth > sellEtherWei) {
            // comfirmed tkn
            uint256 _tokenTransfer = sellEtherWei.mul(order.tkn) / order.eth;
            _transfer(address(this), maker, _tokenTransfer);
            order.maker.transfer(sellEtherWei);
            order.eth = order.eth.sub(sellEtherWei);
            order.tkn = order.tkn.sub(_tokenTransfer);
            book.orders[index] = order;
            return (0, 0);
        } else {
        // top order filled all
            uint256 _tokenTransfer = order.tkn;
            _transfer(address(this), maker, _tokenTransfer);
            order.maker.transfer(order.eth);
            remove(BuyType, index);
            uint256 _restSellEtherWei = sellEtherWei.sub(order.eth);
            // keep price of seller
            uint256 _restSellTokenWei = sellTokenWei.mul(_restSellEtherWei) / sellEtherWei;
            return (_restSellEtherWei, _restSellTokenWei);
        }
    }

	// sell eth, receive tokens, payable in case cancel
	function sell(uint256 tokenWei, address payable maker, bytes32 index) public payable
	returns (bytes32 orderHash) {
		uint256 etherWei = msg.value;
		require(tokenWei > 0);
		require(etherWei > 0);

        // search in books[BuyType]
        OrderList storage book = books[!SellType];
        uint256 restEtherWei = etherWei;
        uint256 restTokenWei = tokenWei;
        while ((restEtherWei > 0) && (book.top != 0)) {
            bytes32 index = book.top;
            Order storage order = book.orders[index];
            if (!sellable(restEtherWei, restTokenWei, order.tkn, order.eth)) {
                break;
            }
            (restEtherWei, restTokenWei) = sellComfirm(maker, restEtherWei, restTokenWei);
        }
        if (restEtherWei == 0) {
            // sold out, not inserted into orderbook
            return 0;
        }
		orderHash = insert(false, restEtherWei, restTokenWei, maker, index);
		emit Sell(orderHash, restEtherWei, restTokenWei, maker);
		return orderHash;
	}

	// receive eth,  sell tokens
	function buy(uint256 etherWei, uint256 tokenWei, address payable maker, bytes32 index) public
	returns (bytes32 orderHash) {
		require(tokenWei > 0);
		require(etherWei > 0);

		// Grab the token.
		_transfer(msg.sender, address(this), tokenWei);

        // search in books[SellType]
        OrderList storage book = books[!BuyType];
        uint256 restTokenWei = tokenWei;
        uint256 restEtherWei = etherWei;
        while ((restTokenWei > 0) && (book.top != 0)) {
            bytes32 index = book.top;
            Order storage order = book.orders[index];
            if (!buyable(restTokenWei, restEtherWei, order.eth, order.tkn)) {
                break;
            }
            (restTokenWei, restEtherWei) = sellComfirm(maker, restTokenWei, restEtherWei);
        }
        if (restTokenWei == 0) {
            // sold out, not inserted into orderbook
            return 0;
        }

		orderHash = insert(true, etherWei, tokenWei, maker, index);
		emit Buy(orderHash, etherWei, tokenWei, maker);
		return orderHash;
	}

	function fillSell(bytes32 orderHash) private {
		bool bookType = SellType;
		OrderList storage book = books[bookType];
		Order storage order = book.orders[orderHash];
		require(order.maker != address(0));

		remove(bookType, orderHash);

		// burn ETH to 0x0
		address(0).transfer(order.eth);
		// mint TOKEN from this contract to maker
		// consensus need to pre-fund this and make sure the contract balance is unchanged after this
		_transfer(address(this), order.maker, order.tkn);

		emit FillSell(orderHash, order.eth, order.tkn, order.maker);
	}

	function inflate(uint256 tokenAmount) private returns (uint256 filledWei, uint256 filledToken) {
		require(tokenAmount > 0);
		bool bookType = SellType;
		OrderList storage book = books[bookType];

		uint256 remainToken = tokenAmount;

		for (bytes32 index = book.top; index[0] != 0; ) {
			Order storage order = book.orders[index];
			if (order.tkn > remainToken) {
				break;
			}
			remainToken = remainToken.sub(order.eth);
			filledWei = filledWei.add(order.tkn);
			fillSell(index);
		}

		filledToken = tokenAmount.sub(remainToken);

		emit Inflate(filledWei, filledToken);
		return (filledWei, filledToken);
	}

	function fillBuy(bytes32 orderHash) private {
		bool bookType = BuyType;
		OrderList storage book = books[bookType];
		Order storage order = book.orders[orderHash];
		require(order.maker != address(0));

		remove(bookType, orderHash);

		// burn TOKEN to 0x0
		_burn(address(this), order.tkn);
		// mint ETH from this contract to maker
		// consensus need to pre-fund this and make sure the contract balance is unchanged after this
		order.maker.transfer(order.eth);

		emit FillBuy(orderHash, order.eth, order.tkn, order.maker);
	}

	function deflate(uint256 tokenAmount) private returns (uint256 filledWei, uint256 filledToken) {
		require(tokenAmount > 0);
		bool bookType = BuyType;
		OrderList storage book = books[bookType];

		uint256 remainToken = tokenAmount;

		for (bytes32 index = book.top; index[0] != 0; ) {
			Order storage order = book.orders[index];
			if (order.tkn > remainToken) {
				break;
			}
			remainToken = remainToken.sub(order.eth);
			filledWei = filledWei.add(order.tkn);
			fillBuy(index);
		}

		filledToken = tokenAmount.sub(remainToken);

		emit Deflate(filledWei, filledToken);
		return (filledWei, filledToken);
	}

	event Sell(bytes32 indexed orderHash, uint256 etherWei, uint256 tokenWei, address indexed maker);
	event Buy(bytes32 indexed orderHash, uint256 etherWei, uint256 tokenWei, address indexed maker);
	event FillSell(bytes32 indexed orderHash, uint256 etherWei, uint256 tokenWei, address indexed maker);
	event FillBuy(bytes32 indexed orderHash, uint256 etherWei, uint256 tokenWei, address indexed maker);
	event Inflate(uint256 ethAmount, uint256 tokenAmount);
	event Deflate(uint256 ethAmount, uint256 tokenAmount);
}
