pragma solidity ^0.5.0;

import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";

// TODO: support non-AON order
contract OrderBook {

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
		bytes32 top;	// the smallest eth/tkn rate 
		bytes32 bottom;	// the largest eth/tkn rate
	}

	IERC20 public token;
	OrderList public sells;
	OrderList public buys;

	function insert(bool buying, uint256 _eth, uint256 _tkn, address payable _maker, bytes32 index) private
	returns (bytes32) {
		OrderList storage book = buying ? buys : sells;
		if (index[0] == 0) {
			index = book.top;
		}

		// search down
		for (; index[0] != 0; index = book.orders[index].next) {
			Order storage order = book.orders[index];
			uint256 a = order.eth.mul(_tkn);
			uint256 b = _eth.mul(order.tkn);
			if (a > b || (a == b && buying)) {
				index = order.prev;
				break;
			}
		}

		// search up
		for (; index[0] != 0; index = book.orders[index].prev) {
			Order storage order = book.orders[index];
			uint256 a = order.eth.mul(_tkn);
			uint256 b = _eth.mul(order.tkn);
			if (a < b || (a == b && !buying)) {
				break;
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

	function buy(uint256 etherWei, address payable maker, bytes32 index) public
	returns (bytes32 orderHash) {
		// Check allowance.
		uint256 tokenWei = token.allowance(msg.sender, address(this));
		require(tokenWei > 0);
		require(etherWei > 0);

		// Grab the token.
		if (!token.transferFrom(msg.sender, address(this), tokenWei)) {
			revert();
		}

		orderHash = insert(true, etherWei, tokenWei, maker, index);
		emit Buy(orderHash, etherWei, tokenWei, maker);
		return orderHash;
	}

	function fill(bytes32 orderHash, bool buying) private {
		OrderList storage book = buying ? buys : sells;
		Order storage order = book.orders[orderHash];
	}

	function fillSell(bytes32 orderHash) private {
		OrderList storage book = sells;
		Order storage order = book.orders[orderHash];
	}

	event Sell(bytes32 orderHash, uint256 etherWei, uint256 tokenWei, address indexed maker);
	event Buy(bytes32 orderHash, uint256 etherWei, uint256 tokenWei, address indexed maker);

	mapping (bytes32 => uint256) public sellOrderBalances;	//a hash of available order balances holds a number of tokens
	mapping (bytes32 => uint256) public buyOrderBalances;	//a hash of available order balances. holds a number of eth

	event MakeBuyOrder(bytes32 orderHash, address indexed token, uint256 tokenWei, uint256 weiAmount, address indexed buyer);

	event MakeSellOrder(bytes32 orderHash, address indexed token, uint256 tokenWei, uint256 weiAmount, address indexed seller);

	event CancelBuyOrder(bytes32 orderHash, address indexed token, uint256 tokenWei, uint256 weiAmount, address indexed buyer);

	event CancelSellOrder(bytes32 orderHash, address indexed token, uint256 tokenWei, uint256 weiAmount, address indexed seller);

	event TakeBuyOrder(bytes32 orderHash, address indexed token, uint256 tokenWei, uint256 weiAmount, uint256 totalTransactionTokens, address indexed buyer, address indexed seller);

	event TakeSellOrder(bytes32 orderHash, address indexed token, uint256 tokenWei, uint256 weiAmount, uint256 totalTransactionWei, address indexed buyer, address indexed seller);
	
	constructor(address _token) public {
		token = IERC20(_token);
	}

	function() external {
		revert();
	}

	// Makes an offer to trade tokenWei of ERC20 token, token, for weiAmount of wei.
	function makeSellOrder(address token, uint256 tokenWei, uint256 weiAmount) public {
		require(tokenWei != 0);
		require(weiAmount != 0);

		bytes32 h = sha256(abi.encodePacked(token, tokenWei, weiAmount, msg.sender));

		// Update balance.
		sellOrderBalances[h] = sellOrderBalances[h].add(tokenWei);

		// Check allowance.  -- Done after updating balance bc it makes a call to an untrusted contract.
		require(tokenWei <= IERC20(token).allowance(msg.sender, address(this)));

		// Grab the token.
		if (!IERC20(token).transferFrom(msg.sender, address(this), tokenWei)) {
			revert();
		}

		emit MakeSellOrder(h, token, tokenWei, weiAmount, msg.sender);
	}

	// Makes an offer to trade msg.value wei for tokenWei of token (an ERC20 token).
	function makeBuyOrder(address token, uint256 tokenWei) public payable {
		require(tokenWei != 0);
		require(msg.value != 0);

		bytes32 h = sha256(abi.encodePacked(token, tokenWei, msg.value, msg.sender));

		//put ether in the buyOrderBalances map
		buyOrderBalances[h] = buyOrderBalances[h].add(msg.value);

		// Notify all clients.
		emit MakeBuyOrder(h, token, tokenWei, msg.value, msg.sender);
	}

	// Cancels all previous offers by msg.sender to trade tokenWei of tokens for weiAmount of wei.
	function cancelAllsells(address token, uint256 tokenWei, uint256 weiAmount) public {
		bytes32 h = sha256(abi.encodePacked(token, tokenWei, weiAmount, msg.sender));
		uint256 remain = sellOrderBalances[h];
		delete sellOrderBalances[h];

		IERC20(token).transfer(msg.sender, remain);

		emit CancelSellOrder(h, token, tokenWei, weiAmount, msg.sender);
	}

	// Cancels any previous offers to trade weiAmount of wei for tokenWei of tokens. Refunds the wei to sender.
	function cancelAllbuys(address token, uint256 tokenWei, uint256 weiAmount) public {
		bytes32 h = sha256(abi.encodePacked(token, tokenWei, weiAmount, msg.sender));
		uint256 remain = buyOrderBalances[h];
		delete buyOrderBalances[h];

		if (!msg.sender.send(remain)) {
			revert();
		}

		emit CancelBuyOrder(h, token, tokenWei, weiAmount, msg.sender);
	}

	// Take some (or all) of the ether (minus fees) in the buyOrderBalances hash in exchange for totalTokens tokens.
	function takeBuyOrder(address token, uint256 tokenWei, uint256 weiAmount, uint256 totalTokens, address payable buyer) public {
		require(tokenWei != 0);
		require(weiAmount != 0);
		require(totalTokens != 0);

		bytes32 h = sha256(abi.encodePacked(token, tokenWei, weiAmount, buyer));

		// How many wei for the amount of tokens being sold?
		uint256 totalTransactionWeiAmount = totalTokens.add(weiAmount) / tokenWei;

		require(buyOrderBalances[h] >= totalTransactionWeiAmount);

		// Proceed with transferring balances.

		// Update our internal accounting.
		buyOrderBalances[h] = buyOrderBalances[h].add(totalTransactionWeiAmount);

		// Did the seller send enough tokens?  -- This check is here bc it calls to an untrusted contract.
		require(IERC20(token).allowance(msg.sender, address(this)) >= totalTokens);

		if (!IERC20(token).transferFrom(msg.sender, buyer, totalTokens)) {
			revert();
		}

		// Send seller the proceeds.
		if (!msg.sender.send(totalTransactionWeiAmount)) {
			revert();
		}

		emit TakeBuyOrder(h, token, tokenWei, weiAmount, totalTokens, buyer, msg.sender);
	}

	function takeSellOrder(address token, uint256 tokenWei, uint256 weiAmount, address payable seller) public payable {
		require(tokenWei != 0);
		require(weiAmount != 0);

		bytes32 h = sha256(abi.encodePacked(token, tokenWei, weiAmount, seller));

		// Check that the contract has enough token to satisfy this order.
		uint256 totalTokens = msg.value.mul(tokenWei).div(weiAmount);
		require(sellOrderBalances[h] >= totalTokens);

		// Transfer.

		// Update internal accounting.
		sellOrderBalances[h] = sellOrderBalances[h].sub(totalTokens);

		// Send buyer the tokens.
		if (!IERC20(token).transfer(msg.sender, totalTokens)) {
			revert();
		}

		// Send seller the proceeds.
		if (!seller.send(msg.value)) {
			revert();
		}

		emit TakeSellOrder(h, token, tokenWei, weiAmount, weiAmount, msg.sender, seller);
	}
}