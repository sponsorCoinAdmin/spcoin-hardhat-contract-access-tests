require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ignition-ethers");
require("hardhat-contract-sizer");
require("dotenv").config();

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.4.17"
      },
      {
        version: "0.4.18"
      },
      {
        version: "0.4.24"
      },
      {
        version: "0.8.0"
      },
      {
        version: "0.8.18",
        settings: {
          optimizer: {
            enabled: true,
            runs: 2000,
          }
        }
      },
    ],
    // version:  "0.8.18",
   },
  networks: {
    hardhat: {
      forking: {
        enable: true,
        // url: "https://mainnet.infura.io/v3/{YOUR INFURA KEY HERE}"
        // or if using .env file use example similar to below
        url: process.env.MAINNET_INFURA_TEST_URL
        // url: process.env.GOERLI_INFURA_TEST_URL
        // url: process.env.SEPOLIA_INFURA_TEST_URL
      },
    },
    mainnet: {
      url: process.env.MAINNET_ALCHEMY_TEST_URL,
      accounts: [process.env.WALLET_SECRET]
    },
    goerli: {
      url: process.env.GOERLI_ALCHEMY_TEST_URL,
      accounts: [process.env.WALLET_SECRET]
    },
    polygon: {
	    url: process.env.POLYGON_ALCHEMY_TEST_URL,
      accounts: [process.env.WALLET_SECRET]
    },
    sepolia: {
      url: process.env.SEPOLIA_ALCHEMY_TEST_URL,
      accounts: [process.env.WALLET_SECRET]
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  },
  mocha: {
    timeout: 100000000,
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true,
    only: ["SPCoin"],
  }
};
