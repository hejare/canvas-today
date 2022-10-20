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
    return Promise.reject({
      location: "external (ipfsProxy site)",
      message: error,
    });
  }
  const reason = "Oops! Something went wrong.";
  return Promise.reject({
    location: "internal (ipfsProxyClient related - Serverside or Client)",
    message: error || reason,
  });
};

const ipfsProxyClient = async (ipfsUrl) => {
  const url = `${ipfsUrl.replace(
    "ipfs://",
    "https://w3s.link/ipfs/",
  )}#x-ipfs-companion-no-redirect`;
  return fetch(url).then(handleResult).catch(handleError);
};

task("add-art", "Add new art to contract")
  .addParam("artId", "The artId")
  .addParam("metaUrl", "The url the should return json meeta data for this NFT")
  .setAction(async function (taskArguments, hre) {
    const contract = await getContract("NFT", hre);
    const response = await contract.addArt(
      taskArguments.artId,
      taskArguments.metaUrl,
      {
        gasLimit: 500_000,
      },
    );
    return response;
  });

task("get-nft-meta-by-artid", "Fetches the NFT metadata")
  .addParam("artId", "The artId")
  .setAction(
    // THIS SHOULD BE REPALCED BY GETTIN GMETA FOR A GIVEN ARTID: getArt(artId)
    async function (taskArguments, hre) {
      const contract = await getContract("NFT", hre);
      // const metadata_url = await contract.baseTokenURI();
      const art = await contract.getArt(taskArguments.artId);
      console.log("Got the Art from contract?", art);
      if (!art.exists) {
        throw new Error(`Art does not exist: ${taskArguments.artId}`);
      }
      const metadata_url = art.metaUrl;
      let metadata;
      if (metadata_url.indexOf("ipfs") === 0) {
        metadata = await ipfsProxyClient(metadata_url);
      } else {
        metadata = await fetch(metadata_url).then((res) => res.json());
      }
      console.log(
        `Metadata fetch response: ${JSON.stringify(metadata, null, 2)}`,
      );
      return metadata;
    },
  );

task("mint", "Mints an art from the NFT contract to contract owner")
  // OBS! Should be evolved to "mintTo" functionality
  .addParam("artId", "The art to mint")
  .setAction(async function (taskArguments, hre) {
    const contract = await getContract("NFT", hre);
    console.log("Before mint...", taskArguments.artId);
    const mintResponse = await contract.mint(taskArguments.artId, {
      gasLimit: 500_000,
    });
    console.log(
      `Transaction Hash: ${mintResponse.hash} and minted ${taskArguments.artId} to: owner`,
    );

    const tokenId = mintResponse;
    console.log(`Token ID: ${tokenId}`);
    // console.log(`Token ID toNumber...: ${tokenId.toNumber()}`); // THIS FAILS! tokenId is [object Object] and not a BigNumber....

    return mintResponse;
  });

task("mintTo", "Mints an art from the NFT contract to input address")
  // OBS! NOT EXISTING YET!
  .addParam("artId", "The art to mint")
  .addParam("address", "The address to receive a token")
  .setAction(async function (taskArguments, hre) {
    const contract = await getContract("NFT", hre);
    const mintResponse = await contract.mintTo(
      taskArguments.artId,
      taskArguments.address,
      {
        gasLimit: 500_000,
      },
    );
    console.log(
      `Transaction Hash: ${mintResponse.hash} and minted to: ${taskArguments.address}`,
    );
    return mintResponse;
  });

// task(
//   "set-base-token-uri",
//   "Sets the base token URI for the deployed smart contract",
// )
//   .addParam("baseUrl", "The base of the tokenURI endpoint to set")
//   .setAction(async function (taskArguments, hre) {
//     const contract = await getContract("NFT", hre);
//     const transactionResponse = await contract.setBaseTokenURI(
//       taskArguments.baseUrl,
//       {
//         gasLimit: 500_000,
//       },
//     );
//     console.log(`Transaction Hash: ${transactionResponse.hash}`);
//     return transactionResponse;
//   });

task(
  "get-nft-meta-by-tokenid",
  "Fetches the token metadata for the given token ID",
)
  .addParam("tokenId", "The tokenID to fetch metadata for")
  .setAction(async function (taskArguments, hre) {
    console.log("get-nft-meta-by-tokenid-----ok?");
    const contract = await getContract("NFT", hre);
    // Note: this fails currently, due to not uploading sub-metadata-files as mentioned in https://docs.opensea.io/docs/part-3-adding-metadata-and-payments-to-your-contract
    // tokenId has to be BigNumber yes?))
    const response = await contract.tokenURI(taskArguments.tokenId, {
      gasLimit: 500_000,
    });
    const metadata_url = response;
    console.log(
      `Metadata URL: ${metadata_url}, tokenId=${taskArguments.tokenId}`,
    );

    let metadata;
    if (metadata_url.indexOf("ipfs") === 0) {
      metadata = await ipfsProxyClient(metadata_url);
    } else {
      metadata = await fetch(metadata_url).then((res) => res.json());
    }
    console.log(
      `Metadata fetch response: ${JSON.stringify(metadata, null, 2)}`,
    );
  });

// task("get-base-token-uri", "Fetches the base token uri").setAction(
//   async function (taskArguments, hre) {
//     const contract = await getContract("NFT", hre);
//     const metadata_url = await contract.baseTokenURI();
//     console.log(`Metadata BASE_URL: ${metadata_url}`);
//     return metadata_url;
//   },
// );
