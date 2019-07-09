pragma solidity ^0.5.2;

interface IOwnableERC223 {
    function registerDex(address _orderbook) external;
    function allowance(address owner, address spender) external returns (uint256);
    function transferFrom(address from, address to, uint256 value) external returns (bool);
    function transfer(address to, uint256 value) external returns (bool);
    function dex() external returns (address);
    function dexMint(uint256 _amount) external;
    function dexBurn(uint256 _amount) external;
}