const path = require("path");
const { ethers } = require("hardhat");

// 在这里填入需要部署的合约名，合约需位于./contracts文件夹内
const CONTRACT_NAME_LIST = ["TripNFT", "TestGreeting"];

// 部署合约的脚本
async function main() {
  const [deployer] = await ethers.getSigners();

  console.log(
    "Deploying contracts with the account:",
    await deployer.getAddress()
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const contractsList = [];

  await Promise.all(
    CONTRACT_NAME_LIST.map((name) => getDeployed(name, contractsList))
  );

  console.log("contractsList", contractsList);

  saveFrontendFiles(contractsList);
}

async function getDeployed(name, contractsList) {
  // deploy
  const factory = await ethers.getContractFactory(name);
  const contract = await factory.deploy();
  await contract.deployed();

  // save to list
  contractsList.push({
    contract,
    name,
  });
}

function saveFrontendFiles(contractsList) {
  const fs = require("fs");
  const contractsDir = path.join(__dirname, "..", "webapp", "contracts");

  // write address

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  const addressObj = {};
  contractsList.forEach(({ name, contract }) => {
    addressObj[name] = contract.address;
  });

  fs.writeFileSync(
    path.join(contractsDir, "contract-address.json"),
    JSON.stringify(addressObj, undefined, 2)
  );

  // === end of write address

  // write artifacts

  contractsList.forEach(({ name }) => {
    const TokenArtifact = artifacts.readArtifactSync(name);

    fs.writeFileSync(
      path.join(contractsDir, name + ".json"),
      JSON.stringify(TokenArtifact, null, 2)
    );
  });

  // === end of write artifacts
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
