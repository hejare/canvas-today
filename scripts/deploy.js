const { task } = require("hardhat/config");
const { getAccount } = require("./helpers");

// eslint-disable-next-line no-unused-vars
task("check-balance", "Prints out the balance of your account").setAction(
  async function (taskArguments, hre) {
    const account = getAccount();
    const balance = await account.getBalance();
    console.log(`Account balance for ${account.address}: ${balance}`);
    return balance;
  },
);

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
