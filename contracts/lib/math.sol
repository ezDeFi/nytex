pragma solidity ^0.5.2;

library math {
    // subtract 2 uints and convert result to int
    function sub(uint a, uint b) internal pure returns(int) {
        return a > b ? int(a - b) : -int(b - a);
    }
}