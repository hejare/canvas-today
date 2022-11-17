/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require("dotenv").config();
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-contract-sizer");
require("./scripts/methods.js");
require("./scripts/deploy.js");
require("./scripts/hre/checkBalance.js");

const {
  ALCHEMY_API_KEY,
  ACCOUNT_PRIVATE_KEY,
  ETHERSCAN_API_KEY,
  // NFT_TOTAL_SUPPLY_PER_CANVAS,
} = process.env; // TODO: Look over how we want to manage account keys etc

module.exports = {
  solidity: {
    version: "0.8.12",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  throwOnTransactionFailures: true,
  throwOnCallFailures: true,
  allowUnlimitedContractSize: true,
  blockGasLimit: 0x1fffffffffffff,

  // defaultNetwork: "mumbai",
  networks: {
    hardhat: {},
    "matic-mumbai": {
      // url: "https://matic-testnet-archive-rpc.bwarelabs.com",
      url: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [`0x${ACCOUNT_PRIVATE_KEY}`],
    },
    "matic-mainnet": {
      url: `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [`0x${ACCOUNT_PRIVATE_KEY}`],
    },
    "eth-goerli": {
      url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [`0x${ACCOUNT_PRIVATE_KEY}`],
    },
    "eth-mainnet": {
      // chainId: 1,
      url: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [`0x${ACCOUNT_PRIVATE_KEY}`],
    },
  },
  mocha: {
    timeout: 100000000,
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
};
