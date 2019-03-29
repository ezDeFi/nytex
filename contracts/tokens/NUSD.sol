pragma solidity ^0.5.5;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./ERC223.sol";
import "./BytesType.sol";

/*
    . Exchanged with NTY with rate 1 WNTY = 10000 NTY
    . Mint. / burn. able(free) by owner = orderbook contract
*/

contract NUSD is ERC223, BytesType {

    modifier onlyOwner() {
        require(
            msg.sender == address(orderbook),
            "only access for owner"
        );
        _;
    }

    constructor (address _orderbook)
        public
    {
        orderbook = OrderbookInterface(_orderbook);
        orderbook.nusdRegister();
    }

    function ownerMint(
        uint256 _amount
    )
        public
        onlyOwner()
    {
        _mint(address(orderbook), _amount);
    }

    // transfer's callback = buy() in orderbook
    function placeOrder(
        uint256 _nusdAmount,
        uint256 _wntyAmount
    )
        public
        payable
    {
        transfer(address(orderbook), _nusdAmount, uint256ToBytes(_wntyAmount));
    }
}