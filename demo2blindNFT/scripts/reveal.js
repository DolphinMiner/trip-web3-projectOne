
// 开启盲盒脚本
require("@nomiclabs/hardhat-ethers");
const hre = require("hardhat");
const config = require("../hardhat.config");

// NFT合约部署成功后的地址
const CONTRACT_ADDRESS = config.mintConfig.contractAddress;

// 合约abi接口
const contractInterface = require("../artifacts/contracts/TripNFT.sol/TripNFT.json").abi;

// 直接构建 infura provider
const provider = new hre.ethers.providers.InfuraProvider(config.mintConfig.network, config.mintConfig.infuraKey);

// 钱包实例
const wallet = new hre.ethers.Wallet(`0x${config.mintConfig.privateKey}`, provider);
// console.log(wallet)

// 合约
const contract = new hre.ethers.Contract(CONTRACT_ADDRESS, contractInterface, provider)
const contractWithSigner = contract.connect(wallet);


// 入口函数
async function main() {
    // 开启盲盒
    await contractWithSigner.flipReveal();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
