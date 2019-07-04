pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./ERC223.sol";
import "../interfaces/IPairEx.sol";

/*
    . Exchanged with NTY with rate 1 MegaNTY = 1000000 NTY
    . Mint. / burn. able(free) by owner = orderbook contract
*/

contract VolatileToken is ERC223 {
    string public constant symbol = "MNTY";
    string public constant name = "Mega NTY";
    uint256 public constant decimals = 24;

    IPairEx internal orderbook;

    constructor (
        address _orderbook,      // mandatory
        address _prefundAddress, // optional
        uint256 _prefundAmount   // optional
    )
        public
    {
        if (_prefundAmount > 0 ) {
            _mint(_prefundAddress, _prefundAmount * 10**decimals);
        }
        initialize(address(_orderbook));
    }

    function registerDex(
        address _orderbook
    )
        external
    {
        // just an interface check
        orderbook = IPairEx(_orderbook);
    }

    // deposit (MNTY <- NTY)
    function deposit()
        external
        payable
        returns(bool)
    {
        depositTo(msg.sender);
    }

    // withdraw (MNTY -> NTY)
    function withdraw(uint256 _amount)
        external
        returns(bool)
    {
        withdrawTo(_amount, msg.sender);
    }

    // withdrawTo (MNTY -> NTY -> address)
    function withdrawTo(uint256 _amount, address payable _to)
        public
        returns(bool)
    {
        address _sender = msg.sender;
        _burn(_sender, _amount);

        /************************************************************************/
        /* concensus garantures, this contract always got enough NTY to withdraw */
        /************************************************************************/

        _to.transfer(_amount);
    }

    // depositTo (addresss <- MNTY <- NTY)
    function depositTo(
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

    // deposit and order (NTY -> MNTY -> USD)
    function depositAndTrade(
        uint256 _haveAmount,
        uint256 _wantAmount,
        bytes32 _assistingID
    )
        public
        payable
    {
        depositTo(msg.sender);
        trade(_haveAmount, _wantAmount, _assistingID);
    }

    // create selling order (NTY -> MNTY -> USD)
    // with verbose data = (wantAmount, assistingID)
    function trade(
        uint256 _haveAmount,
        uint256 _wantAmount,
        bytes32 _assistingID
    )
        public
    {
        bytes memory data = abi.encode(_wantAmount, _assistingID);
        transfer(dex(), _haveAmount, data);
    }
}