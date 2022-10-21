const {MerkleTree} = require('merkletreejs');
const keccak256 = require('keccak256');
require("@nomiclabs/hardhat-ethers");
const hre = require("hardhat");
const config = require("../../hardhat.config");

// NFT合约部署成功后的地址
const CONTRACT_ADDRESS = config.mintConfig.contractAddress;

// 合约abi接口
const contractInterface = require("../../artifacts/contracts/TripNFT.sol/TripNFTV2.json").abi;

// 直接构建测试环境
const provider = new hre.ethers.providers.InfuraProvider(config.mintConfig.network, config.mintConfig.infuraKey);

// 钱包实例
const wallet = new hre.ethers.Wallet(`0x${config.mintConfig.privateKey}`, provider);

// 合约
const contract = new hre.ethers.Contract(CONTRACT_ADDRESS, contractInterface, provider);
const contractWithSigner = contract.connect(wallet);

// 白名单列表用于构造merkleTree
let whitelistAddress = [
    "0x30a5f84d70dd09cf9B58DcE7754F9EB7F65B7C5a",
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
    "0x976EA74026E726554dB657fA54763abd0C3a0aa9",
    "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc"
]

// 构造节点
const leafNodes = whitelistAddress.map((addr) => {
    return keccak256(addr);
});

// 构造merkleTree
const merkleTree = new MerkleTree(leafNodes, keccak256, {sortPairs: true});

// 打印merkleTree结构
console.log('Whitelist Merkle Tree\n', merkleTree.toString());

// 根hash(如果白名单更新，需要更新保存到合约中)
let rootHash = merkleTree.getHexRoot();

// 打印merkleTree根hash
console.log(rootHash);

// 待检验的地址
const claimingAddress = leafNodes[0];
// 获取待检验地址的merkleProof
let hexProof = merkleTree.getHexProof(claimingAddress);
// 打印待检验地址的merkleProof
console.log('hexProof' + '\n' + hexProof);


// test white list
async function main() {

    // 调用合约修改售卖状态
    await contractWithSigner.flipSaleActive();

    // 调用合约的isValidUser方法传入hexProof
    const isValid = await contractWithSigner.isValidUser(hexProof);
    console.log(isValid);

    // 查询售卖状态
    const state = await contractWithSigner.saleIsActive();
    console.log(state);

    // preMint 两个nft
    const mintTx = await contractWithSigner.PreMint(2,hexProof);
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

