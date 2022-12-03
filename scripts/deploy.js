const { task } = require("hardhat/config");
const { getAccount } = require("./helpers");

task(
  "deploy-from-tutorial",
  "Deploy the smart contracts",
  async (taskArgs, hre) => {
    const Marketplace = await hre.ethers.getContractFactory("Marketplace");
    // const marketplace = await Marketplace.deploy();

    // await marketplace.deployed();

    // await hre.run("verify:verify", {
    //   address: marketplace.address,
    //   constructorArguments: []
    // })
  },
);

// task("deploy", "Deploy the smart contracts", async (taskArgs, hre) => {
//   const nftContractFactory = await hre.ethers.getContractFactory("NFT");
//   const nft = await nftContractFactory.deploy(
//     "0x14daa7439c6BdeeAf5c42C5751Fc0B070af57766",
//   );

//   await nft.deployed();

//   await hre.run("verify:verify", {
//     address: nft.address,
//     constructorArguments: [],
//   });
// });

// OBS! This does not work well for Matic-mumbai chain!
task("deploy", "Deploys the NFT.sol contract").setAction(async function (
  taskArguments,
  hre,
) {
  const nftContractFactory = await hre.ethers.getContractFactory(
    "NFT",
    getAccount(),
  );
  const nft = await nftContractFactory.deploy(
    "0x14daa7439c6BdeeAf5c42C5751Fc0B070af57766", // TODO: Use the "wallet" address where all funds should be stored
  );
  console.log(
    `Contract deployed to address: ${nft.address} (Update the NFT_CONTRACT_ADDRESS with this address)`,
  ); // This output address is the value for NFT_CONTRACT_ADDRESS
});
