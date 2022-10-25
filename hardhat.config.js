/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require("dotenv").config();
require("@nomiclabs/hardhat-ethers");
require("./scripts/deploy.js");
// require("./scripts/mint.js");
require("@nomiclabs/hardhat-etherscan");
// require("./scripts/tests.js");
require("hardhat-contract-sizer");
require("./scripts/methods.js");

const {
  ALCHEMY_API_KEY,
  ACCOUNT_PRIVATE_KEY,
  ETHERSCAN_API_KEY,
  // NFT_TOTAL_SUPPLY_PER_CANVAS,
} = process.env; // TODO: Look over how we want to manage account keys etc

module.exports = {
  solidity: "0.8.12",
  defaultNetwork: "goerli",
  networks: {
    hardhat: {},
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [`0x${ACCOUNT_PRIVATE_KEY}`],
    },
    ethereum: {
      chainId: 1,
      url: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [`0x${ACCOUNT_PRIVATE_KEY}`],
    },
    mumbai: {
      chainId: 80001,
      url: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
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
