import { useEffect, useState } from "react";

// We'll use ethers to interact with the Ethereum network and our contract
import { ethers } from "ethers";

import {
  useAccount,
  useBalance,
  useConnect,
  useContract,
  useContractRead,
  useContractReads,
  useProvider,
  useSigner,
} from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

import TripNFTArtifact from "../contracts/TripNFT.json";
import TestGreetingArtifact from "../contracts/TestGreeting.json";
import contractAddress from "../contracts/contract-address.json";

import NoWalletDetected from "./NoWalletDetected";
import ConnectWallet from "./ConnectWallet";
import Loading from "./Loading";
import WaitingForTransactionMessage from "./WaitingForTransactionMessage";
import TransactionErrorMessage from "./TransactionErrorMessage";
import Transfer from "./Transfer";

const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

const DApp = () => {
  // 当前用户的地址
  const { address: currentAddress, isConnected } = useAccount();
  // 用户余额
  const {
    data: balanceData,
    isError: isBalanceError,
    isLoading: isBalanceLoading,
  } = useBalance({ addressOrName: currentAddress });
  // 以太坊网络提供方provider与singer
  const provider = useProvider();
  const { data: signer, isError, isLoading } = useSigner();
  // NFT Contract Object
  const nftContractObj = useContract({
    addressOrName: contractAddress.TripNFT,
    contractInterface: TripNFTArtifact.abi,
    signerOrProvider: signer,
  });
  // Greeting Contract Object
  const testGreetingContractObj = useContract({
    addressOrName: contractAddress.TestGreeting,
    contractInterface: TestGreetingArtifact.abi,
    signerOrProvider: signer,
  });
  // 本地调试用，查看是否正确连接至合约
  const {
    data: greetMsg,
    isError: isContractError,
    isLoading: isContractLoading,
  } = useContractRead({
    addressOrName: contractAddress.TestGreeting,
    contractInterface: TestGreetingArtifact.abi,
    functionName: "greet",
  });
  console.log(greetMsg);

  // 连接钱包
  const { connect, connectors } = useConnect();

  // --------------------------------   方法   --------------------------------------------------

  // 连接钱包
  const connectWallet = async () => {
    // TODO: more wallet
    const MetaMaskConnector = connectors[0];
    await connect({ connector: MetaMaskConnector });
    console.log("connectWallet Successful!");
  };

  // 获取当前账户的nft和以太币的数量
  // const getUserAccountInfo = async () => {

  //   // 获取用户的nft数量
  //   const TripNFT = await this.contractObj.balanceOf(this.state.currentAddress);
  // };

  // // 铸币交易
  // // to：接收nft的地址, amount：铸造的数量
  // const freeMint = async (amount, to) => {
  //   try {
  //     this.dismissTransactionError();
  //     // 调用合约对象的铸造方法mintNft
  //     const tx = await this.contractObj.mintNft(amount, to);
  //     this.setState({ txBeingSent: tx.hash });

  //     const receipt = await tx.wait();
  //     if (receipt.status === 0) {
  //       // We can't know the exact error that made the transaction fail when it
  //       // was mined, so we throw this generic one.
  //       throw new Error("Transaction failed");
  //     }
  //   } catch (error) {
  //     if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
  //       return;
  //     }
  //     console.error(error);
  //     this.setState({ transactionError: error });
  //   } finally {
  //     this.setState({ txBeingSent: undefined });
  //   }
  // };

  // // 发起以太坊转账交易
  // const transferEthers = async (to, amount, data) => {
  //   try {
  //     this.dismissTransactionError();
  //     // 将ether转换为wei
  //     const parseAmount = ethers.utils.parseEther(amount);
  //     const from = this.state.currentAddress;
  //     await window.ethereum.request({
  //       method: "eth_sendTransaction",
  //       params: [
  //         {
  //           from: from,
  //           to: to,
  //           gas: "0xa410", // 0x5208  21000  //0xa410 42000
  //           value: parseAmount._hex,
  //           data: data._hex, //data域普通转账交易可不填
  //         },
  //       ],
  //     });
  //   } catch (error) {
  //     if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
  //       return;
  //     }
  //     console.error(error);
  //     this.setState({ transactionError: error });
  //   } finally {
  //     this.setState({ txBeingSent: undefined });
  //   }
  // };

  // --------------------------------   render   --------------------------------------------------

  // 1. 如果浏览器中没有安装钱包插件,则提示用户安装
  if (window.ethereum === undefined) {
    return <NoWalletDetected />;
  }

  // 2. 如果用户未连接钱包,则返回ConnectWallet组件(连接钱包，初始化用户信息)
  if (!isConnected) {
    return <ConnectWallet connectWallet={connectWallet} />;
  }

  // 4. 初始化完毕后
  return (
    <div className="container p-4">
      <div className="row">
        <div className="col-12">
          {balanceData && (
            <b>
              <span>{"User balance: "}</span>
              {balanceData.formatted} ({balanceData.symbol})
            </b>
          )}

          <p>
            <b>{"User address: "}</b>
            <b>{currentAddress}</b>
            <br></br>
          </p>
        </div>
      </div>

      <hr />

      {/* <div className="row">
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
      </div> */}
    </div>
  );
};

export default DApp;
