pragma solidity ^0.5.5;

contract BytesType {
    function uint256ToBytes(uint256 x) public view returns (bytes memory b) {
        b = new bytes(32);
        assembly { mstore(add(b, 32), x) }
    }
}