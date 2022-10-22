import "../styles/globals.css";
import type { AppProps } from "next/app";

import {
  configureChains,
  chain,
  createClient,
  WagmiConfig,
  defaultChains,
} from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

const ALCHEMY_PROJECT_KEY = process.env.ALCHEMY_PROJECT_KEY;

let client: any;


// Connect to different network (production/goerli/localhost) according to different environment variables.

if (process.env.PROVIDER_MODE === "production") {

  const { chains, provider, webSocketProvider } = configureChains(
    defaultChains,
    [publicProvider()]
  );

  client = createClient({
    autoConnect: true,
    connectors: [new MetaMaskConnector({ chains })],
    provider,
    webSocketProvider,
  });
} else if (process.env.PROVIDER_MODE === "goerli") {

  // Goerli test network
  const { chains, provider, webSocketProvider } = configureChains(
    defaultChains,
    [alchemyProvider({ apiKey: ALCHEMY_PROJECT_KEY }), publicProvider()]
  );

  client = createClient({
    autoConnect: true,
    connectors: [new MetaMaskConnector({ chains })],
    provider,
    webSocketProvider,
  });

} else {


  // localhost network
  const { chains, provider, webSocketProvider } = configureChains(
    defaultChains,
    [
      jsonRpcProvider({
        rpc: (chain) => ({
          http: "http://127.0.0.1:8545/",
        }),
      }),
    ]
  );

  client = createClient({
    autoConnect: true,
    connectors: [new MetaMaskConnector({ chains: [chain.hardhat] })],
    provider,
    webSocketProvider,
  });
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={client}>
      <Component {...pageProps} />
    </WagmiConfig>
  );
}

export default MyApp;
