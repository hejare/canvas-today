const { task } = require("hardhat/config");
const { getContract } = require("./helpers");
const fetch = require("node-fetch");

const convertResult = async (result) => {
  const text = await result.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

const handleResult = async (result) => {
  try {
    const data = await convertResult(result);
    const reason = { external: true, error: data };
    return result.ok ? Promise.resolve(data) : Promise.reject(reason);
  } catch (error) {
    const reason = { external: false, error };
    return Promise.reject(reason);
  }
};

const handleError = async ({ external, error }) => {
  if (external) {
    return Promise.reject({ location: "external (ipfsProxy site)", message: error });
  }
  const reason = "Oops! Something went wrong.";
  return Promise.reject({ location: "internal (ipfsProxyClient related - Serverside or Client)", message: error || reason });
};

const ipfsProxyClient = async (ipfsUrl) => {
  const url = `${ipfsUrl.replace("ipfs://", "https://w3s.link/ipfs/")}#x-ipfs-companion-no-redirect`;
  return fetch(url).then(handleResult).catch(handleError);
};

task("mint", "Mints from the NFT contract")
  .addParam("address", "The address to receive a token")
  .setAction(async function (taskArguments, hre) {
    const contract = await getContract("NFT", hre);
    const transactionResponse = await contract.mintTo(taskArguments.address, {
      gasLimit: 500_000,
    });
    console.log(`Transaction Hash: ${transactionResponse.hash}`);
    return transactionResponse;
  });

task("set-base-token-uri", "Sets the base token URI for the deployed smart contract")
  .addParam("baseUrl", "The base of the tokenURI endpoint to set")
  .setAction(async function (taskArguments, hre) {
    const contract = await getContract("NFT", hre);
    const transactionResponse = await contract.setBaseTokenURI(taskArguments.baseUrl, {
      gasLimit: 500_000,
    });
    console.log(`Transaction Hash: ${transactionResponse.hash}`);
    return transactionResponse;
  });

task("token-uri", "Fetches the token metadata for the given token ID")
  .addParam("tokenId", "The tokenID to fetch metadata for")
  .setAction(async function (taskArguments, hre) {
    const contract = await getContract("NFT", hre);
    // Note: this fails currently, due to not uploading sub-metadata-files as mentioned in https://docs.opensea.io/docs/part-3-adding-metadata-and-payments-to-your-contract
    const response = await contract.tokenURI(taskArguments.tokenId, {
      gasLimit: 500_000,
    });
    const metadata_url = response;
    console.log(`Metadata URL: ${metadata_url}, tokenId=${taskArguments.tokenId}`);

    let metadata;
    if (metadata_url.indexOf("ipfs") === 0) {
      metadata = await ipfsProxyClient(metadata_url);
    } else {
      metadata = await fetch(metadata_url).then(res => res.json());
    }
    console.log(`Metadata fetch response: ${JSON.stringify(metadata, null, 2)}`);
  });

// task("base-token-uri", "Fetches the base token metadata")
task("get-base-token-uri-meta", "Fetches the base token metadata")
  .setAction(async function (taskArguments, hre) {
    const contract = await getContract("NFT", hre);
    const metadata_url = await contract.baseTokenURI();

    let metadata;
    if (metadata_url.indexOf("ipfs") === 0) {
      metadata = await ipfsProxyClient(metadata_url);
    } else {
      metadata = await fetch(metadata_url).then(res => res.json());
    }
    console.log(`Metadata fetch response: ${JSON.stringify(metadata, null, 2)}`);
    return metadata;
  });

task("get-base-token-uri", "Fetches the base token uri")
  .setAction(async function (taskArguments, hre) {
    const contract = await getContract("NFT", hre);
    const metadata_url = await contract.baseTokenURI();
    console.log(`Metadata BASE_URL: ${metadata_url}`);
    return metadata_url;
  });