pragma solidity ^0.5.5;

interface OrderbookInterface {
    function sell(uint256 _wntyAmount, uint256 _nusdAmount, address maker, bytes32 index) external;
    function buy(uint256 _nusdAmount, uint256 _wntyAmount, address payable maker, bytes32 index) external;
    function wntyRegister() external;
    function nusdRegister() external;
}