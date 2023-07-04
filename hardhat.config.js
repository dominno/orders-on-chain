require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require('dotenv').config()

const defaultNetwork = "localhost";

const dev = process.env.DEV_PRIVATE_KEY;
const prod = process.env.PROD_PRIVATE_KEY;
const dev_rpc_goreli = process.env.DEV_RPC_GOREELI || "http://localhost:8545";
const prod_rpc_eth = process.env.PROD_RPC_ETH || "http://localhost:8545";
const etherscan_api_key = process.env.ETHERSCAN_API_KEY;


module.exports = {
  solidity: {
    version: "0.8.17",
    compilers: [
      {
        version: '0.8.17',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.8.0',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      }
    ],
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
  networks: {
    localhost: {
      url: "http://localhost:8545"
    },
    hardhat: {
      chainId: 1337
    },
    goerli: {
      url: dev_rpc_goreli,
      accounts: dev ? [dev] : dev,
    },
    eth: {
     url: prod_rpc_eth,
     accounts: prod ? [prod] : prod,
    },
  },
  etherscan: {
    apiKey: etherscan_api_key
  },
  mocha: {
    timeout: 200000000
  }
};
