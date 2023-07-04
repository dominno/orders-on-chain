// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";

contract OrderContract is Ownable {
    struct Order {
        uint256 id;
        address buyer;
        string product;
        uint256 price;
        string status;
    }

    uint256 private orderCount;
    mapping (uint256 => Order) private orders;
    mapping (address => bool) private admins;
    mapping (address => uint256[]) private buyerOrders;

    modifier onlyBuyerOrOwnerOrAdmin(uint256 _id) {
        require(msg.sender == orders[_id].buyer || msg.sender == owner() || admins[msg.sender] == true, "Not a buyer, owner or admin");
        _;
    }

    constructor() {
        orderCount = 1;
    }

    function createOrder(string memory _product, uint256 _price) public {
        orders[orderCount] = Order(orderCount, msg.sender, _product, _price, "New");
        buyerOrders[msg.sender].push(orderCount);
        orderCount++;
    }

    function getOrder(uint256 _id) public view returns (Order memory) {
        return orders[_id];
    }

    function updateOrderStatus(uint256 _id, string memory _status) public onlyBuyerOrOwnerOrAdmin(_id) {
        Order storage o = orders[_id];
        o.status = _status;
    }

    function getBuyerOrders(address _buyer) public view returns (uint256[] memory) {
        return buyerOrders[_buyer];
    }

    function setAdmin(address _admin, bool _status) public onlyOwner {
        admins[_admin] = _status;
    }
}
