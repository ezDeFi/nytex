pragma solidity ^0.5.5;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./ERC223.sol";
import "./BytesType.sol";

/*
    . Exchanged with NTY with rate 1 WNTY = 10000 NTY
    . Mint. / burn. able(free) by owner = orderbook contract
*/

contract Constants {
    uint256 RATE = 10000;

}

contract WNTY is ERC223, Constants, BytesType {

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
        orderbook.wntyRegister();
    }

    function ownerMint(
        uint256 _amount
    )
        public
        onlyOwner()
    {
        _mint(address(orderbook), _amount);
    }

    function buy()
        public
        payable
        returns(bool)
    {
        buyFor(msg.sender);
    }

    // alias = cashout
    function sell()
        public
        returns(bool)
    {
        address payable _sender = msg.sender;
        uint256 _amount = balanceOf(_sender);
        uint256 _value = _amount * RATE;
        _burn(_sender, _amount);

        /************************************************************************/
        /* concensus garantures, this contract always got enough NTY to cashout */
        /************************************************************************/

        _sender.transfer(_value);
    }

    function buyFor(
        address _to
    )
        public
        payable
        returns(bool)
    {
        uint256 _value = msg.value;
        uint256 _amount = _value / RATE;
        _mint(_to, _amount);
        return true;
    }

    // transfer's callback = sell() in orderbook
    function placeOrder(
        uint256 _wntyAmount,
        uint256 _nusdAmount
    )
        public
        payable
    {
        if (msg.value != 0) buy();
        transfer(address(orderbook), _wntyAmount, uint256ToBytes(_nusdAmount));
    }
}