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

	function sell(uint256 tokenWei, address payable maker, bytes32 index) public payable
	returns (bytes32 orderHash) {
		uint256 etherWei = msg.value;
		require(tokenWei > 0);
		require(etherWei > 0);

		orderHash = insert(false, etherWei, tokenWei, maker, index);
		emit Sell(orderHash, etherWei, tokenWei, maker);
		return orderHash;
	}

	function buy(uint256 etherWei, uint256 tokenWei, address payable maker, bytes32 index) public
	returns (bytes32 orderHash) {
		require(tokenWei > 0);
		require(etherWei > 0);

		// Grab the token.
		_transfer(msg.sender, address(this), tokenWei);

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
