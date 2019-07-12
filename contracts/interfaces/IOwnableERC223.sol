pragma solidity ^0.5.2;

interface IOwnableERC223 {
    function registerDex(address _orderbook) external;
    function dex() external returns (address);
    function dexMint(uint _amount) external;
    function dexBurn(uint _amount) external;
}