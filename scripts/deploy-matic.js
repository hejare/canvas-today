const { ethers } = require("ethers");

// Run this deployment from terminal like this:
// (make sure "polygon_mumbai" conf exists in hardhat.config.js)
// npx hardhat run scripts/deploy.js --network polygon_mumbai

async function main() {
  const undeployedNftContract = await ethers.getContractFactory("NFT");
  const nftContract = await undeployedNftContract.deploy();
  const txHash = nftContract.deployTransaction.hash;
  console.log("Prel. Contract deployed to address:", txHash.address);
  const txReceipt = await ethers.provider.waitForTransaction(txHash);
  console.log("Contract deployed to address:", txReceipt.contractAddress);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
