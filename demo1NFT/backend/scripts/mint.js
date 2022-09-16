// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.

require("@nomiclabs/hardhat-ethers");
const hre = require("hardhat");
const path = require("path");
const fs = require("fs");
const NFTS = require("nft.storage");

const config = require("../hardhat.config");

// nft.storage的APIKey
const storageToken = config.mintConfig.storageKey;
// NFT合约部署成功后的地址
const CONTRACT_ADDRESS = config.mintConfig.contractAddress;

// NFTStorage 客户端实例
const client = new NFTS.NFTStorage({ token: storageToken });

// 合约部署人
const OWNER = config.mintConfig.ownerAddress;

// 合约abi接口
const contractInterface = require("../artifacts/contracts/TripNFT.sol/TripNFT.json").abi;

// fixme 方式一：纯脚本方式不通过浏览器钱包插件的ethereum交互
// 直接构建 infura provider
const provider = new hre.ethers.providers.InfuraProvider(config.mintConfig.network, config.mintConfig.infuraKey);
// 钱包实例
const wallet = new hre.ethers.Wallet(`0x${config.mintConfig.privateKey}`, provider);
console.log(wallet)
// 合约
const contract = new hre.ethers.Contract(CONTRACT_ADDRESS, contractInterface, provider)
const contractWithSigner = contract.connect(wallet);

// fixme  方式二：通过浏览器中钱包的ethereum对象完成，具有交互性，需要与前端结合
// const provider  =  new hre.ethers.providers.Web3Provider(window.ethereum);
// const singer = this.provider.getSigner();
// const contract = new new hre.ethers.Contract(CONTRACT_ADDRESS, contractInterface, singer)

// 上传文件到nft.storage
async function uploadNFTFile({ file, name, description }) {
    console.log("Uploading file to nft storage", { file, name, description });
    const metadata = await client.store({
        name,
        description,
        image: file,
    });
    return metadata;
}

// 铸造NFT
async function mintNFT({
                           filePath,
                           name = "",
                           description = "",
                       }) {
    console.log("要铸造的NFT：", { filePath, name, description });
    const file = fs.readFileSync(filePath);

    // 上传文件至nft.storage中
    const metaData = await uploadNFTFile({
        file: new NFTS.File([file.buffer], name, {
            type: "image/png", // image/png
        }),
        name,
        description,
    });

    console.log("NFT Storage上存储的NFT数据：", metaData);

    // 调用智能合约中的safeMint方法铸币
    const mintTx = await contractWithSigner.safeMint(OWNER, metaData?.url);
    // 等待交易执行完成
    const tx = await mintTx.wait();
    console.log("铸造的NFT区块地址：", tx.blockHash);
}


// 入口函数
async function main() {

    // 读取根目录下assets文件夹下的文件
    const files = fs.readdirSync(path.join(__dirname, "../assets"));
    // 遍历所有文件
    for (const file of files) {
        const filePath = path.join(__dirname, "../assets", file);
        await mintNFT({filePath,
            name: file,
            description: path.join(file)
        });
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });