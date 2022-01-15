import * as dotenv from "dotenv";

import '@nomiclabs/hardhat-ethers';
import {HardhatUserConfig} from 'hardhat/types';
import 'hardhat-deploy';
import '@typechain/hardhat';
import "@nomiclabs/hardhat-etherscan";
// import "hardhat-gas-reporter";
import "solidity-coverage";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.4',
  },
  networks: {
    localhost: {
      live: false,
      saveDeployments: true,
      tags: ['local']
    },
    hardhat: {
      live: false,
      saveDeployments: true,
      tags: ['local', 'test'],
      forking: {
        url: process.env.ALCHEMY_MAINNET_RPC_URL!,
        blockNumber: 14004474
      }
    },
    rinkeby: {
      url: process.env.RINKEBY_URL || "",
      accounts:
        process.env.DEPLOYER_PRIVATE_KEY !== undefined ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
      tags: ['rinkeby']
    },
  },
  typechain: {
    outDir: "./typechain-types",
    target: 'ethers-v5',
    alwaysGenerateOverloads: true
  },
  namedAccounts: {
  deployer: 0,
  buyer: 1,
  seller: 2
},
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};
export default config;
