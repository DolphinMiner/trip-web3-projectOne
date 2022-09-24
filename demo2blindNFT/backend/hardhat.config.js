require("@nomiclabs/hardhat-waffle");

/** @type import('hardhat/config').HardhatUserConfig */

// 账户地址
const OWNER_ADDRESS = "30a5f84d70dd09cf9B58DcE7754F9EB7F65B7C5a";
// 账户私钥 设置为自己的账户私钥
const PRIVATE_KEY = "";

// infrua 可以去infrua官网申请
const INFURA_PROJECT_KEY = "1a1d448adf7045729eea206b7fb589a5";

// alchemy
const ALCHEMY_PORJECT_KEY = "lP56buX2yA871IuM5JLrF9mrV95qHUko";

// nft.storage API Token
const NFT_STORAGE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDc2NDhFOEEwRDhmQUQyMTRERDU1NTg1YWEwMTZlZGRFNWE5NjJDOTIiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2Mjk3MjI0NjA3NiwibmFtZSI6Ik15VGVzdEtleSJ9.PZfFTykgLVawc8RT82p_uonvG7poLBjn1lAb_kGN0KE";

// 部署成功后的合约地址
const NFT_CONTRACT_ADDRESS = "0x49e55BdF88b15c20594787aC86513f6cd41a24Cf";

module.exports = {
  solidity: "0.8.10",
  gas: 500000,
// 配置部署的网络，这里我配置了两个测试环境ropsten和goerli
  networks: {
    ropsten: {
      url: `https://ropsten.infura.io/v3/${INFURA_PROJECT_KEY}`,
      accounts: [`${PRIVATE_KEY}`]

    },
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/${ALCHEMY_PORJECT_KEY}`,
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