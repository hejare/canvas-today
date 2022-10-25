import { Network, Alchemy } from "alchemy-sdk";
import { createAlchemyWeb3 } from "@alch/alchemy-web3";

const apiKey = process.env.ALCHEMY_API_KEY;
const apiBaseUrl = "https://eth-goerli.alchemyapi.io/v2/"; // process.env.ALCHEMY_API_BASE_URL;

const settings = {
  apiKey: apiKey, // "c-CLunrBu0fQtltJkHMD3apuIVHwjAyJ",
  network: Network.ETH_GOERLI, // .MATIC_MAINNET,
};

export const alchemyClient = new Alchemy(settings);

export const web3 = createAlchemyWeb3(`${apiBaseUrl}${apiKey}`);

// const mintTopic = "0x099F3719A1BF3f43c2D72531E770f061342eEbcd";
// const zeroTopic =
//   "0x0000000000000000000000000000000000000000000000000000000000000000";
// const hackrDaoMintEvents = {
//   address: process.env.NFT_CONTRACT_ADDRESS,
//   topics: [mintTopic, zeroTopic],
// };
// const doSomethingWithTxn = (txn) => console.log(txn);
// alchemyClient.ws.on(hackrDaoMintEvents, doSomethingWithTxn);
