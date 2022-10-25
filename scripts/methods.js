const { task } = require("hardhat/config");
// const { getAccount } = require("./helpers");
const { getContract } = require("./helpers");

task("get-art-ids", "Get List of current items").setAction(async function (
  taskArguments,
  hre,
) {
  const contract = await getContract("NFT", hre);
  const itemIds = await contract.getArtIds();
  console.log("Contract itemIds:", itemIds);
  return itemIds;
});

task(
  "get-number-of-minted",
  "Get the current tokenId which is last minted counter",
).setAction(async function (taskArguments, hre) {
  const contract = await getContract("NFT", hre);
  const tokenIdsCurrent = await contract.tokenIds();
  console.log("MINCOUNT:", tokenIdsCurrent.toNumber());
  return tokenIdsCurrent.toNumber();
});

task("add-art", "Create new item?")
  .addParam("artId", "Id for art")
  .addParam("metaUrl", "Url for tokenID meta response")
  .setAction(async function (taskArguments, hre) {
    const contract = await getContract("NFT", hre);
    console.log("hre: taskArguments:", taskArguments);
    const resp = await contract.addArt(
      taskArguments.artId,
      taskArguments.metaUrl,
      // {
      //   gasLimit: 500_000,
      // },
    );
    console.log("hre: resp:", resp);
    return resp;
  });

task("get-art", "Get art by artId")
  .addParam("artId", "Id for art")
  .setAction(async function (taskArguments, hre) {
    const contract = await getContract("NFT", hre);

    const resp = await contract.getArt(taskArguments.artId, {
      gasLimit: 500_000,
    });
    return resp;
  });

task("mint", "Mint new NFT for given artId")
  .addParam("artId", "Id for art")
  .setAction(async function (taskArguments, hre) {
    const contract = await getContract("NFT", hre);

    const resp = await contract.mint(taskArguments.artId, {
      gasLimit: 500_000,
    });
    return resp;
  });

task("token-uri", "Get NFT meta url for given tokenId")
  .addParam("tokenId", "Id for NFT")
  .setAction(async function (taskArguments, hre) {
    const contract = await getContract("NFT", hre);

    const resp = await contract.tokenURI(taskArguments.tokenId, {
      gasLimit: 500_000,
    });
    return resp;
  });
