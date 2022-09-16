# Web3.0

1. demo1NFT应用启动说明：
   1. 需要申请好hardhat.config.js配置文件中需要的key
   2. 在demo1FNT目录下执行npm install 安装依赖 
   3. 在demo1FNT目录下执行npx hardhat compile 编译合约文件会生成一个artifacts文件夹包含了合约的abi接口和字节码文件
   4. 在demo1FNT目录下执行npx hardhat run scripts/deploy.js --network goerli 部署合约
   5. 在demo1FNT目录下执行npx hardhat run scripts/mint.js --network goerli 执行mint脚本
   6. 详细步骤见参考文档  https://rounded-peony-e3f.notion.site/7-NFT-development-797d471bdc7546019d9ceecee8fb9a13
       
   