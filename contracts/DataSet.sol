pragma solidity ^0.5.2;

contract DataSet {
    struct Order {
        address maker;
        uint256 fromAmount;
        uint256 toAmount;

        // linked list
        bytes32 prev;
        bytes32 next;
    }

    struct OrderList {
        mapping (bytes32 => Order) orders;
        bytes32 top;	// the highest priority (lowest sell or highest buy)
        bytes32 bottom;	// the lowest priority (highest sell or lowest buy)
    }

    bool constant internal SellType = false;
    bool constant internal BuyType = true;

    mapping(bool => OrderList) internal books;
}