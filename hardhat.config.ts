import hardhatEthers from "@nomicfoundation/hardhat-ethers";
import { HardhatUserConfig } from "hardhat/types/config";
import hardhatToolboxMochaEthers from "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import * as dotenv from "dotenv";
dotenv.config({ path: "./.env.local" });

const config: HardhatUserConfig = {
  plugins: [hardhatEthers, hardhatToolboxMochaEthers],
  solidity: "0.8.20",
  networks: {
    hardhat: {
      type: "edr-simulated",   
      chainType: "l1",         
      mining: {
        auto: false,           // ❗ отключаем авто, если хотим управлять вручную
        interval: [3000, 5000] // диапазон (или просто число 5000)
      }
    },
    localhost: {
      type: "http",
      chainType: "l1",
      url: "http://127.0.0.1:8545",
      accounts: [process.env.VITE_PRIVATE1!, process.env.VITE_PRIVATE2!]
    },
  },
};

export default config;