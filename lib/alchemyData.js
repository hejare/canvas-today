import { MyWallet } from "@/lib/private/MyWallet";
import { alchemyClient } from "@/services/alchemyClient";
import { Wallet, Utils } from "alchemy-sdk";

// const Web3 = require("web3");
// const web3 = new Web3("https://eth-mainnet.alchemyapi.io/v2/" + apiKey);
// const web3 = new Web3('ws://localhost:8546');

export const sendTransaction = async () => {
  const privateKey = await MyWallet.getPrivateKey();
  console.log(privateKey);
  let wallet = new Wallet(privateKey);
  const nonce = await alchemyClient.core.getTransactionCount(
    wallet.address,
    "latest",
  );

  let transaction = {
    to: "0x31B98D14007bDEe637298086988A0bBd31184523", // faucet address to return eth
    value: 10,
    gasLimit: "21000",
    maxFeePerGas: Utils.parseUnits("20", "gwei"),
    nonce: nonce,
    type: 2,
    chainId: 5,
  };
  let rawTransaction = await wallet.signTransaction(transaction);
  let tx = await alchemyClient.core.sendTransaction(rawTransaction);

  // console.log({ nonce });
  // console.log({ rawTransaction });
  // console.log({ tx });

  // addListenerOnNewPendingTransactions(MyWallet.getAddress(), (...args) => {
  //   console.log("wow, we got trigged!", args);
  // });
  return { tx, nonce, rawTransaction };
};

export const getLatestBlock = async () => {
  return await alchemyClient.core.getBlockNumber();
};

// Get all outbound transfers for a provided address
export const getOutboundTransfers = async () => {
  const address = await MyWallet.getAddress();
  return await alchemyClient.core.getTokenBalances(address);
};

// Get all the NFTs owned by an address
export const getNfts = async () => {
  const address = await MyWallet.getAddress();
  return await alchemyClient.nft.getNftsForOwner(address);
};

// Listen to all new pending transactions
export const addListenerOnNewPendingTransactions = async ({
  address,
  listener,
}) => {
  alchemyClient.ws.on(
    {
      method: "alchemy_pendingTransactions",
      fromAddress: address,
    },
    listener, // (res) => console.log(res)
  );
};
