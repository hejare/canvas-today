const { task } = require("hardhat/config");
const { ethers } = require("ethers");
const { getMainAddress, getProvider } = require("../../config/chainConfig");

task("check-balance", "Prints out the balance of your account")
  .addOptionalParam("address", "optional address to check balance on")
  .setAction(async function (taskArguments, hre) {
    const networkName = taskArguments.networkName || hre.network.name;
    const address = taskArguments.address || getMainAddress(networkName);

    const provider = getProvider(networkName);
    const balanceBN = await provider.getBalance(address);

    // const account = getAccount(networkName);
    // const balance = await account.getBalance();
    const gwei = ethers.utils.formatUnits(
      ethers.BigNumber.from(balanceBN),
      "gwei",
    );
    const eth = ethers.utils.formatEther(ethers.BigNumber.from(balanceBN));

    console.log({ address, gwei, eth, networkName });
    return { address, gwei, eth, networkName };
  });
