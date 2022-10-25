// import { expect, use } from "chai";
// // import { Contract } from "ethers";
// import { deployContract, MockProvider, solidity } from "ethereum-waffle";
// import NFTContract from "../build/NFT.json";

const { expect } = require("chai");
const hre = require("hardhat");
// import { Contract } from "ethers";
// const { deployContract, MockProvider, solidity } = require("ethereum-waffle");
// const NFTContract = require("../build/NFT.json");

describe("NFT Contract - hardhat", function () {
  it("test stuff", async () => {
    // const NFTContract = await hre.ethers.getContractFactory("NFT");
    // const nftContract = await NFTContract.deploy(
    //   "0x14daa7439c6BdeeAf5c42C5751Fc0B070af57766",
    // );
    // // const addArtTx = await nftContract.addArt(1001, "ipfs://lollers.json1");
    // const addArtTx = await nftContract.getArt(1001);
    // console.log("addArtTx:", addArtTx);

    // const artitems = nftContract.getArtIds();
    // console.log("artitems:", artitems);
    expect(true).to.equal(true);
    // console.log(BigNumber.from(1));
  });
});
