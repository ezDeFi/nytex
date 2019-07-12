pragma solidity ^0.5.2;

interface IPairEx {
    function setup(address _volatileTokenAddress, address _stableTokenAddress) external;
    function sell(uint _volatileTokenAmount, uint _stableTokenAmount, address maker, bytes32 index) external;
    function buy(uint _stableTokenAmount, uint _volatileTokenAmount, address payable maker, bytes32 index) external;
    function volatileTokenRegister(address _address) external;
    function stableTokenRegister(address _address) external;
}