import { Network, Alchemy } from "alchemy-sdk";
import { createAlchemyWeb3 } from "@alch/alchemy-web3";

const apiKey = process.env.ALCHEMY_API_KEY;
// const apiBaseUrl = "https://eth-goerli.alchemyapi.io/v2/"; // process.env.ALCHEMY_API_BASE_URL;
const apiBaseUrl = "https://polygon-mumbai.g.alchemy.com/v2/"; // process.env.ALCHEMY_API_BASE_URL;

//polygon-mumbai.g.alchemy.com/v2/

const settings = {
  apiKey: apiKey, // "c-CLunrBu0fQtltJkHMD3apuIVHwjAyJ",
  // network: Network.ETH_GOERLI, // .MATIC_MAINNET,
  network: Network.MATIC_MUMBAI, // .MATIC_MAINNET,
};

export const alchemyClient = new Alchemy(settings);

export const web3 = createAlchemyWeb3(`${apiBaseUrl}${apiKey}`);
