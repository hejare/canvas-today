// Right click on the script name and hit "Run" to execute
const { expect } = require("chai");
const { ethers } = require("hardhat");
// const twoot = require("@ethersproject/bignumber");

describe("Storage (in Remix, NFT here)", function () {
  it("test stuff", async function () {
    const Storage = await ethers.getContractFactory("NFT");
    const storage = await Storage.deploy(
      "0x14daa7439c6BdeeAf5c42C5751Fc0B070af57766",
    );
    const deployResp = await storage.deployed();

    await storage.addArt(1001, "ipfs://lollers.json1");
    await storage.addArt(1002, "ipfs://lollers.json2");
    const art1 = await storage.getArt(1001);
    const art2 = await storage.getArt(1002);
    console.log("art1=", art1);
    console.log("art2=", art2);

    const artitems = await storage.getArtIds();
    console.log("artitems:", artitems);

    await storage.mint(1001);
    const tokenIdsCurrent = await storage.tokenIds();
    console.log("MINCOUNT:", tokenIdsCurrent.toNumber());

    const meta = await storage.tokenURI(artitems[0]); // BigNumber(1));
    console.log("meta:", meta);
    expect(true).to.equal(true);
  });
});
