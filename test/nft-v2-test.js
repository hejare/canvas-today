const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("NFT Art Test", function () {
  let nftContract1;
  // let marketplace;
  let account1;
  this.beforeEach(async function () {
    const Artwork = await ethers.getContractFactory("NFTv2");
    // const Marketplace = await ethers.getContractFactory("MarketplaceLeo");

    nftContract1 = await Artwork.deploy(
      "0x14daa7439c6BdeeAf5c42C5751Fc0B070af57766", // TODO: Use the "wallet" address where all funds should be stored
    ); //"Canvas Art Today Contract", "CAT");
    // marketplace = await Marketplace.deploy();

    [account1] = await ethers.getSigners();
    // const tokenURI1 =
    //   "https://opensea-creatures-api.herokuapp.com/api/creature/1";
    // const tokenURI2 =
    //   "https://opensea-creatures-api.herokuapp.com/api/creature/2";

    // await nftContract1.connect(account1).mint(tokenURI1);
    // await nftContract1.connect(account1).mint(tokenURI2);

    // Approving marketplace to spend NFTs
    // await nftContract1.connect(account1).approve(marketplace.address, 0);
  });

  it("Add Art", async function () {
    // Listing NFT
    await nftContract1.connect(account1).addArt(
      1337,
      "ipfs://bafyreieotq5vjciv7cxncusdilyejwod6cmdwmtdi2hwt6wjf2a6qpamie/metadata.json",
      2,
      // TODO: Extend support to set a minimum price per added art.
      // ethers.utils.parseEther("0.1"),
      // {
      //   value: ethers.utils.parseEther("0.01"),
      // },
    );
    const theArt_preMint = await nftContract1.connect(account1).getArt(1337);
    expect(theArt_preMint.maxSupply).to.equal(2);
    expect(theArt_preMint.counter).to.equal(0);
    const artIds = await nftContract1.connect(account1).getArtIds();
    expect(artIds[0].toString()).to.equal("1337");

    await nftContract1.connect(account1).mint(1337);
    const theArt_1 = await nftContract1.connect(account1).getArt(1337);
    expect(theArt_1.counter).to.equal(1);

    await nftContract1.connect(account1).mint(1337);
    const theArt_2 = await nftContract1.connect(account1).getArt(1337);
    expect(theArt_2.counter).to.equal(2);

    await expect(nftContract1.connect(account1).mint(1337)).to.be.revertedWith(
      "Max supply reached",
    );
  });

  //   it("NFT can't be listed if listingPrice is not paid", async function () {
  //     await expect(
  //       marketplace
  //         .connect(account1)
  //         .listMarketItem(
  //           nftContract1.address,
  //           0,
  //           2,
  //           ethers.utils.parseEther("0.1"),
  //           { value: ethers.utils.parseEther("0") },
  //         ),
  //     ).to.be.revertedWith("Must pay the listing price");
  //   });

  //   it("NFT can't be listed if maxCount is not greater than 0", async function () {
  //     await expect(
  //       marketplace
  //         .connect(account1)
  //         .listMarketItem(
  //           nftContract1.address,
  //           0,
  //           0,
  //           ethers.utils.parseEther("0.1"),
  //           { value: ethers.utils.parseEther("0.01") },
  //         ),
  //     ).to.be.revertedWith("maxCount must be greater than 0");
  //   });

  //   it("NFT can't be listed if NFT is not approved by user", async function () {
  //     await expect(
  //       marketplace
  //         .connect(account1)
  //         .listMarketItem(
  //           nftContract1.address,
  //           1,
  //           2,
  //           ethers.utils.parseEther("0.1"),
  //           {
  //             value: ethers.utils.parseEther("0.01"),
  //           },
  //         ),
  //     ).to.revertedWith("ERC721: caller is not token owner or approved");
  //   });
  // });

  // describe("Buying of NFT", function () {
  //   let nftContract1;
  //   let marketplace;
  //   let account1;
  //   let account2;
  //   let prevBalance;
  //   let presentBalance;
  //   this.beforeEach(async function () {
  //     const Artwork = await ethers.getContractFactory("Artwork");
  //     const Marketplace = await ethers.getContractFactory("MarketplaceLeo");

  //     nftContract1 = await Artwork.deploy("Artwork Contract", "ART");
  //     marketplace = await Marketplace.deploy();

  //     [account1, account2] = await ethers.getSigners();
  //     const tokenURI =
  //       "https://opensea-creatures-api.herokuapp.com/api/creature/1";

  //     await nftContract1.connect(account1).mint(tokenURI);
  //     await nftContract1.connect(account1).approve(marketplace.address, 0);
  //     await marketplace
  //       .connect(account1)
  //       .listMarketItem(
  //         nftContract1.address,
  //         0,
  //         2,
  //         ethers.utils.parseEther("0.1"),
  //         {
  //           value: ethers.utils.parseEther("0.01"),
  //         },
  //       );
  //   });

  //   it("Buying NFT", async function () {
  //     prevBalance = await nftContract1.balanceOf(account2.address);
  //     await marketplace
  //       .connect(account2)
  //       .buyMarketItem(0, { value: ethers.utils.parseEther("0.1") });
  //     presentBalance = await nftContract1.balanceOf(account2.address);

  //     expect(prevBalance).to.equal(0);
  //     expect(presentBalance).to.equal(1);
  //   });

  //   it("NFT can't be bought by paying a lower price", async function () {
  //     await expect(
  //       marketplace
  //         .connect(account2)
  //         .buyMarketItem(0, { value: ethers.utils.parseEther("0.01") }),
  //     ).to.be.revertedWith("Must pay the correct price");
  //   });

  //   it("NFT can't be bought tricee... but thats not the issue...Se NOTE at the top", async function () {
  //     await marketplace
  //       .connect(account2)
  //       .buyMarketItem(0, { value: ethers.utils.parseEther("0.1") });
  //     const listedNFT = await marketplace.getMarketItem(0);
  //     expect(listedNFT.count).to.equal("1");
  //     expect(listedNFT.isSold).to.equal(false);
  //     // await expect(
  //     //   marketplace
  //     //     .connect(account2)
  //     //     .buyMarketItem(0, { value: ethers.utils.parseEther("0.1") }),
  //     // ).to.be.revertedWith("Item is already sold out");
  //   });
});
