import { ethers } from "ethers";

// contract imports
import TestGreetingArtifact from "../contracts/TestGreeting.json";
import TripNFTArtifact from "../contracts/TripNFT.json";
import contractAddress from "../contracts/contract-address.json";

import { useEffect, useRef, useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const _providerRef = useRef<any>();
  const _contractTestGreetingRef = useRef<any>();
  const [selectedAddress, setSelectedAddress] = useState();

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    if (window.ethereum) {
      const [selectedAddress] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setSelectedAddress(selectedAddress);

      _providerRef.current = new ethers.providers.Web3Provider(window.ethereum);
      _contractTestGreetingRef.current = new ethers.Contract(
        contractAddress.TestGreeting,
        TestGreetingArtifact.abi,
        _providerRef.current.getSigner(0)
      );

      getGreetingFromContract();
    }
  };

  const getGreetingFromContract = async () => {
    const greetingFromContract = await _contractTestGreetingRef.current.greet();
    console.log("greetingFromContract", greetingFromContract);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Hello NFT</title>
        <meta name="description" content="Hello NFT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Hello, Welcome to Web 3.0!</h1>
      </main>
    </div>
  );
};

export default Home;
