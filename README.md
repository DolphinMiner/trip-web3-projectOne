# 环境准备
### 确保本地已正确安装node环境
nodejs官网下载安装包：https://nodejs.org/en/
也可以使用nvm来做版本管理：https://github.com/nvm-sh/nvm
如已安装nvm，可在项目目录下使用`nvm use`来快速将node版本同步至开发推荐版本。

### 配置测试环境以太坊
浏览器安装matemask插件，并注册使用一个开发wallet：https://metamask.io/
在metamask设置中添加localhost的开发网络环境配置：
网络名称：Localhost 8545
新增 RPC URL：http://localhost:8545
链ID：1337
货币符号：ETH

### 个人私钥写入env
在demo1NFT目录下的.env文件(没有的话请创建)中输入metamask的地址和私钥，
具体的key在.env.example中有示例。  

# 使用localhost环境
###  安装项目依赖  
`cd ./demo1NFT`  
`npm i`

### 运行本地node服务  
`npx hardhat node`

### 部署合约至localhost  
terminal新开窗口  
`npm run deploy`  
或  
`npx hardhat --network localhost run ./scripts/deploy.js`  
部署前会自动打包，打包内容写入artifacts里，同时合约地址和打包结果也会备份至./webapp/contracts下以便前端调用。

### 安全前端依赖
terminal新开窗口  
`cd webapp`  
`npm i`  

### 启动前端页面至localhost
`npm run dev`


# 使用goerli环境
### goerli 部署合约
在demo1FNT目录下执行
`npx hardhat run scripts/mint.js --network goerli`
   
### goerli 执行mint脚本
详细步骤见参考文档  https://rounded-peony-e3f.notion.site/7-NFT-development-797d471bdc7546019d9ceecee8fb9a13

# 部署上mainnet
//todo


# quickStart
1. 配置环境：在该目录中新建.env文件，根据env.examples文件中的内容进行补齐
2. 合约编译：cd ./demo2blindNFT npx hardhat compile 编译合约文件会在项目目录中生成artifacts，将生成的/artifacts/contracts/TripNFT.sol/TripNFT.json内容，拷贝至webapp/src/contracts/contract.json中
3. 合约部署：cd ./demo2blindNFT npx hardhat run scripts/deploy.js --network goerli 生成的合约地址拷贝至webapp/src/contracts/contract-address.json中的Token属性
4. 启动web：cd ./webapp nmp install  npm run start 启动前端应用
5. 进行铸币过程中提示gas out请在钱包交易时修改gas limit = 300000