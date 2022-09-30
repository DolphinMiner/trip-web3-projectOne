// We'll use ethers to interact with the Ethereum network and our contract
import { ethers } from "ethers";

import TripNFTArtifact from "../contracts/TripNFT.json";
import contractAddress from "../contracts/contract-address.json";

import { NoWalletDetected } from "./NoWalletDetected";
import { ConnectWallet } from "./ConnectWallet";
import { Loading } from "./Loading";
import { WaitingForTransactionMessage } from "./WaitingForTransactionMessage";
import { TransactionErrorMessage } from "./TransactionErrorMessage";
import { Transfer } from "./Transfer";

const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

export class DApp extends React.Component {
  constructor(props) {
    super(props);

    this.initialState = {
      // nft的数据包括name和symbol
      tokenData: undefined,
      // 当前用户的地址
      currentAddress: undefined,
      // 以太坊余额
      balance: undefined,
      // NFT数目
      TripNFT: undefined,
      // 合约对象
      contractObj: undefined,

      // 当前发送的交易id
      txBeingSent: undefined,
      transactionError: undefined,
      networkError: undefined,
    };
    this.state = this.initialState;
  }

  render() {
    // 1. 如果浏览器中没有安装钱包插件,则提示用户安装
    if (window.ethereum === undefined) {
      return <NoWalletDetected />;
    }

    // 2. 如果用户未连接钱包,则返回ConnectWallet组件(连接钱包，初始化用户信息)
    if (!this.state.currentAddress) {
      return <ConnectWallet connectWallet={() => this.connectWallet()} />;
    }

    // 3. 如果用户账户信息还没有加载完成，展示Loading组件
    if (!this.state.tokenData || !this.state.balance) {
      return <Loading />;
    }

    // 4. 初始化完毕后
    return (
      <div className="container p-4">
        <div className="row">
          <div className="col-12">
            <h1>
              {this.state.tokenData.name} ({this.state.tokenData.symbol})
            </h1>
            <p>
              Welcome <b>{this.state.currentAddress}</b>
              <br></br>
              Ethers:
              <b>{this.state.balance.toString() + " "}</b>
              wei
              <br></br>
              TripNFT:
              <b>{this.state.TripNFT.toString()}</b>
            </p>
          </div>
        </div>

        <hr />

        <div className="row">
          <div className="col-12">
            {this.state.txBeingSent && (
              <WaitingForTransactionMessage txHash={this.state.txBeingSent} />
            )}

            {this.state.transactionError && (
              <TransactionErrorMessage
                message={this.getRpcErrorMessage(this.state.transactionError)}
                dismiss={() => this.dismissTransactionError()}
              />
            )}
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            {this.state.balance.gt(0) && (
              <Transfer
                transferTokens={(to, amount) => this.freeMint(amount, to)}
                transferEthers={(to, amount, data) =>
                  this.transferEthers(to, amount, data)
                }
                tokenSymbol={this.state.tokenData.symbol}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------   方法   --------------------------------------------------

  // 连接钱包
  async connectWallet() {
    // 1.申请连接钱包
    const [userAddress] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    // 2.初始化用户账户信息
    this.initialize(userAddress);

    console.log("connectWallet Successful!");
  }

  // 初始化以太坊账户信息
  async initialize(userAddress) {
    // 1.保存用户的地址
    this.setState({ currentAddress: userAddress });

    // 2.构造合约对象
    await this.createContractObj();

    // 3.保存合约中Token定义的name和symbol
    await this.getTokenData();

    // 4.获取用户拥有的以太币和海豚币的数量
    await this.getUserAccountInfo();
  }

  // 创建合约对象
  async createContractObj() {
    // 初始化ethers对象
    this.provider = new ethers.providers.Web3Provider(window.ethereum);

    // 获取当前provider中的账户(也可以直接用this._provider.getSigner(0))
    const singer = this.provider.getSigner();
    console.log("singer", singer);

    const address = await singer.getAddress();
    console.log("address", address);
    // 通过abi文件和合约地址创建合约对象
    this.contractObj = new ethers.Contract(
      contractAddress.TripNFT,
      TripNFTArtifact.abi,
      singer
    );
  }

  // 获取智能合约中定义的NFT的属性
  async getTokenData() {
    const name = await this.contractObj.name();
    const symbol = await this.contractObj.symbol();

    this.setState({ tokenData: { name, symbol } });
  }

  // 获取当前账户的nft和以太币的数量
  async getUserAccountInfo() {
    // 获取用户的以太币
    const balance = await this.provider.getBalance(this.state.currentAddress);

    // 获取用户的nft数量
    const TripNFT = await this.contractObj.balanceOf(this.state.currentAddress);

    this.setState({ balance, TripNFT });
  }

  getRpcErrorMessage(error) {
    if (error.data) {
      return error.data.message;
    }
    return error.message;
  }

  dismissTransactionError() {
    this.setState({ transactionError: undefined });
  }

  // 铸币交易
  // to：接收nft的地址, amount：铸造的数量
  async freeMint(amount, to) {
    try {
      this.dismissTransactionError();
      // 调用合约对象的铸造方法mintNft
      const tx = await this.contractObj.mintNft(amount, to);
      this.setState({ txBeingSent: tx.hash });

      const receipt = await tx.wait();
      if (receipt.status === 0) {
        // We can't know the exact error that made the transaction fail when it
        // was mined, so we throw this generic one.
        throw new Error("Transaction failed");
      }
    } catch (error) {
      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return;
      }
      console.error(error);
      this.setState({ transactionError: error });
    } finally {
      this.setState({ txBeingSent: undefined });
    }
  }

  // 发起以太坊转账交易
  async transferEthers(to, amount, data) {
    try {
      this.dismissTransactionError();
      // 将ether转换为wei
      const parseAmount = ethers.utils.parseEther(amount);
      const from = this.state.currentAddress;
      await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: from,
            to: to,
            gas: "0xa410", // 0x5208  21000  //0xa410 42000
            value: parseAmount._hex,
            data: data._hex, //data域普通转账交易可不填
          },
        ],
      });
    } catch (error) {
      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return;
      }
      console.error(error);
      this.setState({ transactionError: error });
    } finally {
      this.setState({ txBeingSent: undefined });
    }
  }
}
