import { Network, Alchemy } from "alchemy-sdk";

const apiKey = process.env.ALCHEMY_API_KEY;
// const apiBaseUrl = process.env.ALCHEMY_API_BASE_URL;

const settings = {
  apiKey: apiKey, // "c-CLunrBu0fQtltJkHMD3apuIVHwjAyJ",
  network: Network.ETH_GOERLI, // .MATIC_MAINNET,
};

export const alchemyClient = new Alchemy(settings);
