const { ethers } = require("ethers");
const { getContractAt } = require("@nomiclabs/hardhat-ethers/internal/helpers");
const { getProvider, getNftContractAddress } = require("config/chainConfig");

const { ACCOUNT_PRIVATE_KEY } = process.env;

function getAccountPrivateKey(networkName) {
  // TODO!!!
  return ACCOUNT_PRIVATE_KEY;
}

function getAccount(networkName) {
  return new ethers.Wallet(
    getAccountPrivateKey(networkName),
    getProvider(networkName),
  );
}

function getContract(contractName, hre, networkName) {
  const account = getAccount(networkName);
  const contractAddress = getNftContractAddress(networkName);
  console.log({ account, contractAddress });
  return getContractAt(hre, contractName, contractAddress, account);
}

module.exports = {
  getAccount,
  getContract,
};
