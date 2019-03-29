pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./ERC223.sol";
import "./../lib/BytesConvert.sol";
import "./../interfaces/IOrderbook.sol";

/*
    ...
*/

contract NUSD is ERC223{
    using BytesConvert for *;

    IOrderbook internal orderbook;

    constructor (address _orderbook)
        public
    {
        initialize(_orderbook);
        orderbook = IOrderbook(_orderbook);
        orderbook.nusdRegister();
    }
}