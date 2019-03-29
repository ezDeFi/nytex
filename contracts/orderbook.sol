pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./Install.sol";

contract Orderbook is Install {
    constructor () 
        public
    {
    }

    // Token transfer's fallback
    function tokenFallback(
        address _from,
        uint _value,
        bytes calldata _data) 
        external
    {

    }
}