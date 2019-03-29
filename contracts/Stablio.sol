pragma solidity ^0.5.5;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract Stablio is ERC20 {
    string public constant name = "Nexty USD";
    string public constant symbol = "nUSD";
    uint8 public constant decimals = 18;
}

