import { useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";

import {
  useAccount,
  useBalance,
  useConnect,
  useContract,
  useContractRead,
  useContractWrite,
  useSigner,
} from "wagmi";
import classnames from "classnames";

import { getMerkleProof } from "../utils/merkleTree";
import { MintDialogStatus } from "../constants";
import BgImage from "./BgImage";

import styles from "../styles/DApp.module.css";
import MintDialog from "./MintDialog";
import ExploMonCarousel from "./ExploMonCarousel";

// 根据环境获取NFT配置函数
const getNFTConfigs = (isInProduction: boolean) => {
  const dir_suffix = isInProduction ? "-aws" : "";
  return {
    TripNFTArtifact: require(`../contracts${dir_suffix}/TripNFT.json`),
    contractAddress: require(`../contracts${dir_suffix}/contract-address.json`),
  }
}

// 检测当前环境
const isInProduction = process.env.PROVIDER_MODE === "production"

const { TripNFTArtifact, contractAddress } = getNFTConfigs(isInProduction)

// Mint合约的配置
const nftContractConfig = {
  addressOrName: contractAddress.TripNFT,
  contractInterface: TripNFTArtifact.abi,
};

// 售卖阶段
enum SALE_STATE {
  CLOSED = 0,
  PRE_MINT = 1,
  PUBLIC_MINT = 2,
}

const DApp = () => {
  // 当前用户的地址
  const { address: currentAddress, isConnected } = useAccount();

  /*  == 合约的读与写 ==  */

  // 通过读取是否在白名单内
  const merkleProof = currentAddress && getMerkleProof(currentAddress);
  const { data: isInWhiteList, error: validUserErr } = useContractRead({
    ...nftContractConfig,
    functionName: "isValidUser",
    args: [merkleProof],
    overrides: { from: currentAddress },
  });
  // 售卖时间段
  const { data: saleStageBigInt, error: saleStageErr } = useContractRead({
    ...nftContractConfig,
    functionName: "saleStage",
  }) as { data: any | undefined };
  const saleStage: SALE_STATE = parseInt(saleStageBigInt || 0);
  // 是否可售
  const { data: saleIsActive, error: saleIsActiveErr } = useContractRead({
    ...nftContractConfig,
    functionName: "saleIsActive",
  }) as { data: Boolean | undefined}
  // 通过读取合约字段活动铸造售价
  const { data: mintPrice } = useContractRead({
    ...nftContractConfig,
    functionName: "mintPrice",
  }) as { data: BigNumber | undefined };
  // public mint
  const { writeAsync: preMintAsync, error: preMintError } = useContractWrite({
    ...nftContractConfig,
    mode: "recklesslyUnprepared",
    functionName: "preMint",
  });
  // public mint
  const { writeAsync: publicMintAsync, error: publicMintError } =
    useContractWrite({
      ...nftContractConfig,
      mode: "recklesslyUnprepared",
      functionName: "publicMint",
    });

  /*  == End ==  */

  const greetMsg = "ExploMon on your land!";
  // 倒计时时钟指针
  let countDownPointer: ReturnType<typeof setInterval> | null;
  // 倒计时文案
  const [countDownText, setCountDownText] = useState("--:--:--");
  // mint按钮状态
  const [isMintLoading, setMintLoading] = useState(false);
  // mint结果弹窗开关
  const [isShowDialog, setShowDialog] = useState(false);
  // mint弹窗对应状态
  const [dialogStatus, setDialogStatus] = useState(MintDialogStatus.FAILURE);

  // 连接钱包
  const { connect, connectors } = useConnect({
    onSuccess(data) {
      console.log('connectWallet Successful!')
    },
    onError(error) {
      setShowDialog(true);
      setDialogStatus(MintDialogStatus.CONNECT_WALLET_FAILED)
    },
  });

  useEffect(() => {
    startCountDown();
    return () => {
      clearInterval(countDownPointer);
    };
  }, []);

  // 连接钱包
  const connectWallet = async () => {
    // TODO: more wallet
    const MetaMaskConnector = connectors[0];
    await connect({ connector: MetaMaskConnector });
  };

  // 铸造请求
  const requestMint = async () => {
    // 还未读取到合约内容 或 售卖还未开启
    if (!saleStage) return;

    setMintLoading(true);

    // 需要调用的方法
    let mintFnAsync;
    // 需要传入的价格
    let sendValue: BigNumber = ethers.utils.parseEther("0");
    // 需要传给合约的参数
    let args = [];
    switch (saleStage) {
      case SALE_STATE.PRE_MINT:
        mintFnAsync = preMintAsync;
        args = [1, merkleProof];
        break;
      case SALE_STATE.PUBLIC_MINT:
        mintFnAsync = publicMintAsync;
        sendValue = mintPrice || sendValue;
        args = [1];
        break;
    }

    try {
      const tx = await mintFnAsync({
        recklesslySetUnpreparedArgs: args,
        recklesslySetUnpreparedOverrides: {
          from: currentAddress,
          value: sendValue, // 传入合约里的售价
        },
      });

      const receipt = await tx.wait();
      console.log({ receipt });
      setDialogStatus(MintDialogStatus.SUCCESS);
      setShowDialog(true);
    } catch (error) {
      console.error(error);
      setDialogStatus(MintDialogStatus.FAILURE);
      setShowDialog(true);
    } finally {
      setMintLoading(false);
    }
  };

  const startCountDown = () => {
    countDownPointer = setInterval(() => {
      const restTotalSeconds = (new Date("2022/10/25") - new Date()) / 1000;
      const seconds = Math.floor(restTotalSeconds % 60);
      const minutes = Math.floor((restTotalSeconds / 60) % 60);
      const hours = Math.floor((restTotalSeconds / 60 / 60) % 24);
      const days = Math.floor(restTotalSeconds / 60 / 60 / 24);

      setCountDownText(`${days} days ${hours}:${minutes}:${seconds}`);
    }, 1000);
  };

  const renderConnector = () => {
    return (
      <div className="absolute right-0 top-0">
        {isConnected ? (
          <button
            type="button"
            onClick={connectWallet}
            className={styles.walletWelcome}
          >
            Welcome{" "}
            {`${currentAddress?.substr(0, 4)}...${currentAddress?.substr(-4)}`}!
          </button>
        ) : (
          <button
            className={styles.walletLogin}
            type="button"
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        )}
      </div>
    );
  };

  const renderMintButton = () => {
    // 是否开启预售
    const isOnPreMint = saleStage === SALE_STATE.PRE_MINT && isInWhiteList;
    // 是否开启公售
    const insOnPublicMint =
      saleStage === SALE_STATE.PUBLIC_MINT && currentAddress;
    // 是否能铸造
    const isAble = saleIsActive && (isOnPreMint || insOnPublicMint);
    // 按钮文案
    const btnText = !currentAddress
      ? "Connect wallet first."
      : !isAble
      ? "Out of store."
      : isMintLoading
      ? "Minting..."
      : "MINT!";

    return (
      <div className="mt-10 ml-8">
        <button
          className={isAble ? styles.mintAble : styles.mintDisable}
          type="button"
          onClick={() => isAble && requestMint()}
        >
          <span className="font-bold text-xl">{btnText}</span>
        </button>
      </div>
    );
  };

  // 4. 初始化完毕后
  return (
    <div
      className="relative h-640px w-1080px m-auto px-16 py-12 bg-white rounded-xl shadow-2xl"
      style={{
        backgroundImage: "linear-gradient(to top, #dfe9f3  0%, #ffffff 100%)",
      }}
    >
      <BgImage />

      <div className="relative">
        {renderConnector()}

        <h1
          className={classnames([
            "text-black font-bold text-5xl mt-0",
            styles.titleText,
          ])}
        >
          {greetMsg}
        </h1>

        <ExploMonCarousel />

        <h1 className="text-black font-bold text-3xl mt-16 ml-10">
          Sale Ends In: {`${countDownText}`}
        </h1>

        {renderMintButton()}
      </div>
      <MintDialog
        isShowDialog={isShowDialog}
        dialogStatus={dialogStatus}
        setShowDialog={setShowDialog}
      />
    </div>
  );
};

export default DApp;
