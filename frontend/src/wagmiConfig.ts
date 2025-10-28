import {
    getDefaultConfig,
} from "@rainbow-me/rainbowkit";
import { hardhat } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "Upgradeable Proxy dApp",
  projectId: "YOUR_WALLET_CONNECT_PROJECT_ID",
  chains: [hardhat],
  ssr: false,
});