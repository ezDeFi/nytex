pragma solidity ^0.5.2;

library BytesConvert {
    function uint256ToBytes(uint256 x) public pure returns (bytes memory b) {
        b = new bytes(32);
        assembly { mstore(add(b, 32), x) }
    }
}