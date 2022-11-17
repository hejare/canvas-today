const { ethers } = require("ethers");

const { ALCHEMY_API_KEY } = process.env;

const mumbaiProvider = {
  name: "maticmum",
  chainId: 80001,
  _defaultProvider: (providers) =>
    new providers.JsonRpcProvider(
      `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
    ),
};

const networks = {
  "eth-mainnet": {
    isTestnet: false,
    name: "Ethereum Mainnet",
    chainId: 1,
    provider: ethers.getDefaultProvider("mainnet", {
      alchemy: ALCHEMY_API_KEY,
    }),
  },
  "eth-goerli": {
    isTestnet: true,
    name: "Ethereum Goerli",
    chainId: 5,
    provider: ethers.getDefaultProvider("goerli", {
      alchemy: ALCHEMY_API_KEY,
    }),
  },
  "matic-mainnet": {
    isTestnet: false,
    name: "Polygon (Matic) Mainnet",
    chainId: 137,
    provider: ethers.getDefaultProvider("matic", {
      alchemy: ALCHEMY_API_KEY,
    }),
  },
  "matic-mumbai": {
    isTestnet: true,
    name: "Polygon (Matic) Mumbai",
    chainId: 80001,
    provider: ethers.getDefaultProvider(mumbaiProvider, {
      alchemy: ALCHEMY_API_KEY,
    }),
  },
};

// const chainConfig = {
//   ethereum: {
//     symbol: "ETH",
//   },
//   polygon: {
//     symbol: "MATIC",
//   },
// };

function validateNetworkName(networkName, cause = "continue") {
  if (!networks[networkName.toLowerCase()]) {
    throw new Error(
      `Can not ${cause} since networkName ${networkName} is not supported!`,
    );
  }
}

// "0x59abf3837fa962d6853b4cc0a19513aa031fd32b" (mainnet) = huge FTX scam drainer!!!
function getMainAddress(networkName) {
  validateNetworkName(networkName, "get main address"); // Throws Error!
  const NETWORK_NAME = networkName.toUpperCase();
  return process.env[`NETWORK_${NETWORK_NAME}_MAIN_ACCOUNT_ADDRESS`];
}

function getProvider(networkName) {
  validateNetworkName(networkName, "get provider"); // Throws Error!
  return networks[networkName.toLowerCase()].provider;
}

function getNftContractAddress(networkName) {
  validateNetworkName(networkName, "get NFT contract address"); // Throws Error!
  const NETWORK_NAME = networkName.toUpperCase();
  return process.env[`NETWORK_${NETWORK_NAME}_NFT_CONTRACT_ADDRESS`];
}

module.exports = {
  getProvider,
  getMainAddress,
  getNftContractAddress,
};
