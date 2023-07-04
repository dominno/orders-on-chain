const hre = require("hardhat");

async function main() {
  const OrderContract = await hre.ethers.getContractFactory("OrderContract");
  const contract = await OrderContract.deploy();
  await contract.deployed();

  console.log("OrderContract deployed to:", contract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
