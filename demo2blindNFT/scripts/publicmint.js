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

    // 调用合约修改售卖状态开始售卖
    await contractWithSigner.flipSaleActive();

    // fixme 待解决在调用合约publicMint的时候设置本次交易携带的金额？，公售0.01eth一个 (待解决)
    // fixme 前端通过ethereum调用的时候如何设置交易金额 (已解决)
    // 调用智能合约中的publicMint方法铸币，需要支付，所以交易需要携带金额
    const mintTx = await contractWithSigner.publicMint(1);
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