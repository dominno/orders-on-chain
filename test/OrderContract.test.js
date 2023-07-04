const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");
use(solidity);

describe("OrderContract", function () {
  let OrderContract, orderContract, owner, addr1, addr2;

  beforeEach(async function () {
    OrderContract = await ethers.getContractFactory("OrderContract");
    [owner, addr1, addr2, _] = await ethers.getSigners();
    orderContract = await OrderContract.deploy();
  });

  it("Should create new order correctly", async function () {
    await orderContract.connect(addr1).createOrder("Product 1", ethers.utils.parseEther("1"));
    const order = await orderContract.getOrder(1);
    expect(order.id.toNumber()).to.equal(1);
    expect(order.product).to.equal("Product 1");
    expect(order.price.toString()).to.equal(ethers.utils.parseEther("1").toString());
    expect(order.buyer).to.equal(addr1.address);
  });

  it("Should allow order status update by owner", async function () {
    await orderContract.connect(addr1).createOrder("Product 1", ethers.utils.parseEther("1"));
    await orderContract.connect(owner).updateOrderStatus(1, "Shipped");
    const order = await orderContract.getOrder(1);
    expect(order.status).to.equal("Shipped");
  });

  it("Should not allow non-owners to update order status", async function () {
    await orderContract.connect(addr1).createOrder("Product 1", ethers.utils.parseEther("1"));
    await expect(orderContract.connect(addr2).updateOrderStatus(1, "Shipped")).to.be.revertedWith("Not a buyer, owner or admin");
  });

  it("Should allow buyer to update order status", async function () {
    await orderContract.connect(addr1).createOrder("Product 1", ethers.utils.parseEther("1"));
    await orderContract.connect(addr1).updateOrderStatus(1, "Received");
    const order = await orderContract.getOrder(1);
    expect(order.status).to.equal("Received");
  });

  it("Should increment orderCount correctly", async function () {
    await orderContract.connect(addr1).createOrder("Product 1", ethers.utils.parseEther("1"));
    await orderContract.connect(addr1).createOrder("Product 2", ethers.utils.parseEther("2"));
    const order1 = await orderContract.getOrder(1);
    const order2 = await orderContract.getOrder(2);
    expect(order1.id.toNumber()).to.equal(1);
    expect(order2.id.toNumber()).to.equal(2);
  });

  it("Should return correct buyer orders", async function () {
      await orderContract.connect(addr1).createOrder("Product 1", ethers.utils.parseEther("1"));
      await orderContract.connect(addr1).createOrder("Product 2", ethers.utils.parseEther("2"));
      const buyerOrders = await orderContract.getBuyerOrders(addr1.address);
      expect(buyerOrders.length).to.equal(2);
      expect(buyerOrders[0].toNumber()).to.equal(1);
      expect(buyerOrders[1].toNumber()).to.equal(2);
  });

  it("Should allow owner to set and unset admin", async function () {
      await orderContract.setAdmin(addr1.address, true);
      await expect(orderContract.connect(addr1).updateOrderStatus(1, "Shipped")).to.not.be.reverted;
      await orderContract.setAdmin(addr1.address, false);
      await expect(orderContract.connect(addr1).updateOrderStatus(1, "Shipped")).to.be.revertedWith("Not a buyer, owner or admin");
  });

  it("Should allow admin to update order status", async function () {
      await orderContract.connect(addr1).createOrder("Product 1", ethers.utils.parseEther("1"));
      await orderContract.setAdmin(addr2.address, true);
      await orderContract.connect(addr2).updateOrderStatus(1, "Shipped");
      const order = await orderContract.getOrder(1);
      expect(order.status).to.equal("Shipped");
  });

});
