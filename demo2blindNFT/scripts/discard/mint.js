// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.

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

// 合约
const contract = new hre.ethers.Contract(CONTRACT_ADDRESS, contractInterface, provider)
const contractWithSigner = contract.connect(wallet);


// 入口函数
async function main() {
    // 接收者的地址
    const recipient = "30a5f84d70dd09cf9B58DcE7754F9EB7F65B7C5a";
    console.log("接受NFT的地址：", recipient);

    // 设置交易汽油费

    // 调用智能合约中的mintNft方法铸币 mint个数，以及接收者
    const mintTx = await contractWithSigner.mintNft(1,recipient);
    // 等待交易执行完成
    const tx = await mintTx.wait();
    console.log("铸造的NFT区块地址：", tx.blockHash);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });