import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "@rainbow-me/rainbowkit/styles.css";
import './index.css'
import {
  RainbowKitProvider,
  getDefaultConfig,
} from "@rainbow-me/rainbowkit";
import {
  WagmiProvider,
} from "wagmi";
import { hardhat } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DebugInfo } from "./Debug";


const config = getDefaultConfig({
  appName: "Upgradeable Proxy dApp",
  projectId: "YOUR_WALLET_CONNECT_PROJECT_ID", // получи с https://cloud.walletconnect.com
  chains: [hardhat],
  ssr: false,
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <App />
          <DebugInfo/>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
