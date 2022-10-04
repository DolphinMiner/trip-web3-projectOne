require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */

const OWNER_ADDRESS = process.env.OWNER_ADDRESS;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const INFURA_PROJECT_KEY = process.env.INFURA_PROJECT_KEY;
const ALCHEMY_PROJECT_KEY = process.env.ALCHEMY_PROJECT_KEY;
const NFT_STORAGE_KEY = process.env.NFT_STORAGE_KEY;
const NFT_CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS;

module.exports = {
  solidity: "0.8.10",
  gas: 500000,
// 配置部署的网络，这里我配置了两个测试环境ropsten和goerli
  networks: {
    hardhat: {
      chainId: 1337 // We set 1337 to make interacting with MetaMask simpler
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${INFURA_PROJECT_KEY}`,
      accounts: [`${PRIVATE_KEY}`]

    },
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/${ALCHEMY_PROJECT_KEY}`,
      accounts: [`${PRIVATE_KEY}`],
      gas: 500000
    },
  },
  // 配置mint需要的属性，这里是通过NFT.Storage铸币，所在的链是goerli测试链
  mintConfig:{
    contractAddress:`${NFT_CONTRACT_ADDRESS}`,
    storageKey:`${NFT_STORAGE_KEY}`,
    privateKey: `${PRIVATE_KEY}`,
    infuraKey:`${INFURA_PROJECT_KEY}`,
    ownerAddress:`${OWNER_ADDRESS}`,
    network:'goerli'
  }
};