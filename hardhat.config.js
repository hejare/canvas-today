/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require("dotenv").config();
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-contract-sizer");
require("./scripts/methods.js");
require("./scripts/deploy.js");

/* Future example-structure for supported chains:

  "matic-mumbai": {
    id: "matic-mumbai",
    name: "Mumbai",

    info: {
      chainID: 80001,
    },

    explorer: {
      byAddress: (address: string) => `https://mumbai.polygonscan.com/address/${address}`,
      byHash: (hash: string) => `https://mumbai.polygonscan.com/tx/${hash}`,
    },

    nft: {
      supported: true,
      marketplaceUrl: (address: string, id: string) => `https://testnets.opensea.io/assets/mumbai/${address}/${id}`,
      marketplaceName: "OpenSea",
    },
  },
*/

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

  defaultNetwork: "polygon_mumbai",
  networks: {
    hardhat: {},
    polygon_mumbai: {
      // chainId: 80001,
      url: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [`0x${ACCOUNT_PRIVATE_KEY}`],
    },
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [`0x${ACCOUNT_PRIVATE_KEY}`],
    },
    // ethereum: {
    //   chainId: 1,
    //   url: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
    //   accounts: [`0x${ACCOUNT_PRIVATE_KEY}`],
    // },
  },
  mocha: {
    timeout: 100000000,
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
};
