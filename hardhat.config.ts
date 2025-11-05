import "dotenv/config";
import type { HardhatUserConfig } from "hardhat/config";

import hardhatToolboxMochaEthersPlugin from "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import hardhatVerify from "@nomicfoundation/hardhat-verify";
import { configVariable } from "hardhat/config";

const TEST_KEY        = configVariable("TEST_KEY")
const PRODUCTION_KEY  = configVariable("PRODUCTION_KEY")

const config: HardhatUserConfig = {
  plugins: [
    hardhatToolboxMochaEthersPlugin,
    hardhatVerify
  ],
  solidity: {
     
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    
  
  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },
    hardhatOp: {
      type: "edr-simulated",
      chainType: "op",
    },
    mainnet: {
      type: "http",
      chainType: "l1",
      url:   configVariable("MAINNET_RPC_URL"),
      accounts : [PRODUCTION_KEY]
    },
    polygon: {
      type: "http",
      chainType: "l1",
      url:   configVariable("POLYGON_RPC_URL"),
      accounts : [PRODUCTION_KEY]
    },
    arbitrum: {
      type: "http",
      chainType: "l1",
      url:   configVariable("ARBITRUM_RPC_URL"),
      accounts : [PRODUCTION_KEY]
    },
    base: {
      type: "http",
      chainType: "l1",
      url:   configVariable("BASE_RPC_URL"),
      accounts : [PRODUCTION_KEY]
    },
    sepolia: {
      type: "http",
      chainType: "l1",
      url:   configVariable("SEPOLIA_RPC_URL"),
      accounts: [TEST_KEY],
    },
    amoy: {
      type: "http",
      url:   configVariable("AMOY_RPC_URL"),
      accounts: [TEST_KEY],
    },
    arbitrum_sepolia: {
      type: "http",
      url:   configVariable("ARBITRUM_SEPOLIA_RPC_URL"),
      accounts: [TEST_KEY],
    },
    base_sepolia: {
      type: "http",
      url:   configVariable("BASE_SEPOLIA_RPC_URL"),
      accounts: [TEST_KEY],
    },
  },
  verify: {
    etherscan: {
      apiKey: configVariable("ETHERSCAN_API_KEY"),
    }

  },
  chainDescriptors:{
    421614 : {
      name: "arbitrum sepolia",
      blockExplorers:{
        etherscan:{
          name: "arbiscan",
          url: "https://sepolia.arbiscan.io/",
          apiUrl: "https://api.etherscan.io/v2/api"
        }
      }
    }
  }
};

export default config;
