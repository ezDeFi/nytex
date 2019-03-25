pragma solidity ^0.5.0;

contract SafeMath {
	function safeMul(uint256 a, uint256 b) internal pure returns (uint256) {
		uint c = a * b;
		assert(a == 0 || c / a == b);
		return c;
	}

	function safeSub(uint256 a, uint256 b) internal pure returns (uint256) {
		assert(b <= a);
		return a - b;
	}

	function safeAdd(uint256 a, uint256 b) internal pure returns (uint256) {
		uint c = a + b;
		assert(c >= a && c >= b);
		return c;
	}

	//  function assert(bool assertion) internal {
	//    if (!assertion) throw;
	//  }
}

// ERC Token Standard #20 Interface
// https://github.com/ethereum/EIPs/issues/20
contract ERC20Interface {
	// Get the total token supply
	function totalSupply() public view returns (uint256 supply);

	// Get the account balance of another account with address _owner
	function balanceOf(address _owner) public view returns (uint256 balance);

	// Send _value amount of tokens to address _to
	function transfer(address _to, uint256 _value) public returns (bool success);

	// Send _value amount of tokens from address _from to address _to
	function transferFrom(address _from, address _to, uint256 _value) public returns (bool success);

	// Allow _spender to withdraw from your account, multiple times, up to the _value amount.
	// If this function is called again it overwrites the current allowance with _value.
	// this function is required for some DEX functionality
	function approve(address _spender, uint256 _value) public returns (bool success);

	// Returns the amount which _spender is still allowed to withdraw from _owner
	function allowance(address _owner, address _spender) public view returns (uint256 remaining);

	// Triggered when tokens are transferred.
	event Transfer(address indexed _from, address indexed _to, uint256 _value);

	// Triggered whenever approve(address _spender, uint256 _value) is called.
	event Approval(address indexed _owner, address indexed _spender, uint256 _value);
}

contract OrderBook is SafeMath {
	mapping (bytes32 => uint256) public sellOrderBalances;	//a hash of available order balances holds a number of tokens
	mapping (bytes32 => uint256) public buyOrderBalances;	//a hash of available order balances. holds a number of eth

	event MakeBuyOrder(bytes32 orderHash, address indexed token, uint256 tokenAmount, uint256 weiAmount, address indexed buyer);

	event MakeSellOrder(bytes32 orderHash, address indexed token, uint256 tokenAmount, uint256 weiAmount, address indexed seller);

	event CancelBuyOrder(bytes32 orderHash, address indexed token, uint256 tokenAmount, uint256 weiAmount, address indexed buyer);

	event CancelSellOrder(bytes32 orderHash, address indexed token, uint256 tokenAmount, uint256 weiAmount, address indexed seller);

	event TakeBuyOrder(bytes32 orderHash, address indexed token, uint256 tokenAmount, uint256 weiAmount, uint256 totalTransactionTokens, address indexed buyer, address indexed seller);

	event TakeSellOrder(bytes32 orderHash, address indexed token, uint256 tokenAmount, uint256 weiAmount, uint256 totalTransactionWei, address indexed buyer, address indexed seller);

	constructor() public {
	}

	function() external {
		revert();
	}

	// Makes an offer to trade tokenAmount of ERC20 token, token, for weiAmount of wei.
	function makeSellOrder(address token, uint256 tokenAmount, uint256 weiAmount) public {
		require(tokenAmount != 0);
		require(weiAmount != 0);

		bytes32 h = sha256(abi.encodePacked(token, tokenAmount, weiAmount, msg.sender));

		// Update balance.
		sellOrderBalances[h] = safeAdd(sellOrderBalances[h], tokenAmount);

		// Check allowance.  -- Done after updating balance bc it makes a call to an untrusted contract.
		require(tokenAmount <= ERC20Interface(token).allowance(msg.sender, address(this)));

		// Grab the token.
		if (!ERC20Interface(token).transferFrom(msg.sender, address(this), tokenAmount)) {
			revert();
		}

		emit MakeSellOrder(h, token, tokenAmount, weiAmount, msg.sender);
	}

	// Makes an offer to trade msg.value wei for tokenAmount of token (an ERC20 token).
	function makeBuyOrder(address token, uint256 tokenAmount) public payable {
		require(tokenAmount != 0);
		require(msg.value != 0);

		bytes32 h = sha256(abi.encodePacked(token, tokenAmount, msg.value, msg.sender));

		//put ether in the buyOrderBalances map
		buyOrderBalances[h] = safeAdd(buyOrderBalances[h], msg.value);

		// Notify all clients.
		emit MakeBuyOrder(h, token, tokenAmount, msg.value, msg.sender);
	}

	// Cancels all previous offers by msg.sender to trade tokenAmount of tokens for weiAmount of wei.
	function cancelAllSellOrders(address token, uint256 tokenAmount, uint256 weiAmount) public {
		bytes32 h = sha256(abi.encodePacked(token, tokenAmount, weiAmount, msg.sender));
		uint256 remain = sellOrderBalances[h];
		delete sellOrderBalances[h];

		ERC20Interface(token).transfer(msg.sender, remain);

		emit CancelSellOrder(h, token, tokenAmount, weiAmount, msg.sender);
	}

	// Cancels any previous offers to trade weiAmount of wei for tokenAmount of tokens. Refunds the wei to sender.
	function cancelAllBuyOrders(address token, uint256 tokenAmount, uint256 weiAmount) public {
		bytes32 h = sha256(abi.encodePacked(token, tokenAmount, weiAmount, msg.sender));
		uint256 remain = buyOrderBalances[h];
		delete buyOrderBalances[h];

		if (!msg.sender.send(remain)) {
			revert();
		}

		emit CancelBuyOrder(h, token, tokenAmount, weiAmount, msg.sender);
	}

	// Take some (or all) of the ether (minus fees) in the buyOrderBalances hash in exchange for totalTokens tokens.
	function takeBuyOrder(address token, uint256 tokenAmount, uint256 weiAmount, uint256 totalTokens, address payable buyer) public {
		require(tokenAmount != 0);
		require(weiAmount != 0);
		require(totalTokens != 0);

		bytes32 h = sha256(abi.encodePacked(token, tokenAmount, weiAmount, buyer));

		// How many wei for the amount of tokens being sold?
		uint256 totalTransactionWeiAmount = safeMul(totalTokens, weiAmount) / tokenAmount;

		require(buyOrderBalances[h] >= totalTransactionWeiAmount);

		// Proceed with transferring balances.

		// Update our internal accounting.
		buyOrderBalances[h] = safeSub(buyOrderBalances[h], totalTransactionWeiAmount);

		// Did the seller send enough tokens?  -- This check is here bc it calls to an untrusted contract.
		require(ERC20Interface(token).allowance(msg.sender, address(this)) >= totalTokens);

		if (!ERC20Interface(token).transferFrom(msg.sender, buyer, totalTokens)) {
			revert();
		}

		// Send seller the proceeds.
		if (!msg.sender.send(totalTransactionWeiAmount)) {
			revert();
		}

		emit TakeBuyOrder(h, token, tokenAmount, weiAmount, totalTokens, buyer, msg.sender);
	}

	function takeSellOrder(address token, uint256 tokenAmount, uint256 weiAmount, address payable seller) public payable {
		require(tokenAmount != 0);
		require(weiAmount != 0);

		bytes32 h = sha256(abi.encodePacked(token, tokenAmount, weiAmount, seller));

		// Check that the contract has enough token to satisfy this order.
		uint256 totalTokens = safeMul(msg.value, tokenAmount) / weiAmount;
		require(sellOrderBalances[h] >= totalTokens);

		// Transfer.

		// Update internal accounting.
		sellOrderBalances[h] = safeSub(sellOrderBalances[h], totalTokens);

		// Send buyer the tokens.
		if (!ERC20Interface(token).transfer(msg.sender, totalTokens)) {
			revert();
		}

		// Send seller the proceeds.
		if (!seller.send(msg.value)) {
			revert();
		}

		emit TakeSellOrder(h, token, tokenAmount, weiAmount, weiAmount, msg.sender, seller);
	}
}