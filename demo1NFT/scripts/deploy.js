
const { ethers } = require("hardhat");

// 部署合约的脚本
async function main() {
    //
  const [deployer] = await ethers.getSigners();

  console.log(
      "Deploying contracts with the account:",
      await deployer.getAddress()
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const TokenFactory = await ethers.getContractFactory("TripNFT");
  const tokenContract = await TokenFactory.deploy();

  await tokenContract.deployed();

  console.log("Token address:", tokenContract.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
