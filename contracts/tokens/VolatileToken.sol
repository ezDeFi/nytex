pragma solidity ^0.5.2;

import "../../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./ERC223.sol";
import "../lib/BytesConvert.sol";
import "../lib/ABI.sol";
import "../interfaces/IPairEx.sol";

/*
    . Exchanged with NTY with rate 1 VolatileToken = 1 NTY
    . Mint. / burn. able(free) by owner = orderbook contract
*/

contract VolatileToken is ERC223 {
    using BytesConvert for *;
    using ABI for *;

    IPairEx internal orderbook;

    constructor (address _orderbook)
        public
    {
        orderbook = IPairEx(_orderbook);
        orderbook.wntyRegister();
        initialize(address(_orderbook));
        _mint(msg.sender, 1000000);
    }


    function buy()
        public
        payable
        returns(bool)
    {
        buyFor(msg.sender);
    }

    // alias = cashout
    function sell(uint256 _amount)
        public
        returns(bool)
    {
        sellTo(_amount, msg.sender);
    }

    function sellTo(uint256 _amount, address payable _to)
        public
        returns(bool)
    {
        address _sender = msg.sender;
        _burn(_sender, _amount);

        /************************************************************************/
        /* concensus garantures, this contract always got enough NTY to cashout */
        /************************************************************************/

        _to.transfer(_amount);
    }

    function buyFor(
        address _to
    )
        public
        payable
        returns(bool)
    {
        uint256 _amount = msg.value;
        _mint(_to, _amount);
        return true;
    }

    function buy(uint _value, bytes memory _data) 
        public 
        payable 
    {
        buy();
        transfer(owner(), _value, _data);
    }

    // TESTING
    function simpleBuy(
        uint256  _value,
        uint256 _toAmount,
        bytes32 _checkpoint
    ) 
        public 
        payable 
    {
        bytes memory data = abi.encode(_toAmount, _checkpoint);
        buy(_value, data);
    }
}