import { STATUS_NOK_TEXT, STATUS_OK_TEXT } from "@/services/responseConstants";
import { run } from "hardhat";
import { alchemyClient, web3 } from "@/services/alchemyClient";
import { ethers } from "hardhat/internal/lib/hardhat-lib";
import utils from "web3-utils";

const getAllFees = async () => {
  const historicalBlocks = 20;
  const history = await web3.eth.getFeeHistory(
    historicalBlocks,
    "latest",
    [25, 50, 75],
  );
  const { reward, baseFeePerGas } = history;
  const oldestBlock = Number(history.oldestBlock);
  const latestGasEstimates = reward.map((block, i) => {
    const allGasInfo = {
      blockNumber: oldestBlock + i,
      baseFeePerGas: Number(baseFeePerGas[i]),
      priorityFeePerGas: block.map((x) => Number(x)),
    };
    return {
      blockNumber: allGasInfo.blockNumber,
      low: ethers.utils.formatUnits(
        allGasInfo.baseFeePerGas + allGasInfo.priorityFeePerGas[0],
        "gwei",
      ),
      medium: ethers.utils.formatUnits(
        allGasInfo.baseFeePerGas + allGasInfo.priorityFeePerGas[1],
        "gwei",
      ),
      high: ethers.utils.formatUnits(
        allGasInfo.baseFeePerGas + allGasInfo.priorityFeePerGas[2],
        "gwei",
      ),
    };
  });

  const calculateAverage = (arr) => {
    const sum = arr.reduce((a, v) => a + v);
    return Math.round(sum / arr.length);
  };

  const currentBlock = await web3.eth.getBlock("pending");
  const currentBaseFeePerGas = Number(currentBlock.baseFeePerGas);
  const lowAverage = calculateAverage(
    latestGasEstimates.map((estimate) => estimate.low),
  );
  const midAverage = calculateAverage(
    latestGasEstimates.map((estimate) => estimate.medium),
  );
  const highAverage = calculateAverage(
    latestGasEstimates.map((estimate) => estimate.high),
  );

  return {
    props: {
      latestGasEstimates,
      averages: {
        low: lowAverage + currentBaseFeePerGas,
        medium: midAverage + currentBaseFeePerGas,
        high: highAverage + currentBaseFeePerGas,
      },
    },
  };
};

const PERCENTILE_SLOW = 10;
const PERCENTILE_NORMAL = 60;
const PERCENTILE_FAST = 85;
const fetchHistoryFees = async () => {
  const numBlocks = 35;

  const ethersProvider = await alchemyClient.config.getProvider();
  console.log("ethersProvider", ethersProvider);
  const feeData = await ethersProvider.getFeeHistory(numBlocks, "latest", [
    PERCENTILE_SLOW,
    PERCENTILE_NORMAL,
    PERCENTILE_FAST,
  ]);
  console.log("feeData:", feeData);
  return {
    slow: getGetGasHistoryPrice(feeData, 0),
    normal: getGetGasHistoryPrice(feeData, 1),
    fast: getGetGasHistoryPrice(feeData, 2),
  };
};
const getGetGasHistoryPrice = (data, percentileIndex) => {
  // It's not certain that the number of returned blocks matches the number of requested blocks
  const numBlocks = data.baseFeePerGas.length;

  let totalGasPrice = ethers.BigNumber(0);
  for (let i = 0; i < numBlocks; i++) {
    totalGasPrice = totalGasPrice.add(data.baseFeePerGas[i]);

    if (data.reward && data.reward[i]) {
      // Reward data may sometimes not be available
      totalGasPrice = totalGasPrice.add(data.reward[i][percentileIndex]);
    }
  }

  return totalGasPrice.div(numBlocks).toString(0);
};

const fetchFees = (gasPrice) => {
  const gasPriceBN = gasPrice; // ethers.BigNumber.from(gasPrice);

  return {
    slow: gasPriceBN.toString(),
    // normal: gasPriceBN.mul(1.1).toString(),
    // fast: gasPriceBN.mul(1.3).toString(),
  };
};

const getNonce = async () => {
  return alchemyClient.core.getTransactionCount(
    "0x14daa7439c6BdeeAf5c42C5751Fc0B070af57766",
    // "latest",
  );
  // return await Web3.eth.getTransactionCount(
  //   "0x14daa7439c6BdeeAf5c42C5751Fc0B070af57766",
  // ),
};

const estimateGas = async () => {
  const dataSha = utils
    .sha3("mint(uint256 artId) public payable")
    .substr(0, 10);

  const tx = {
    // Wrapped ETH address
    to: "0x14daa7439c6BdeeAf5c42C5751Fc0B070af57766",
    // `function deposit() payable`
    // data: "0xd0e30db0", // "function deposit() payable"
    data: dataSha,
    // 1 ether
    // value: parseEther("1.0"),
  };
  return alchemyClient.core.estimateGas(tx);
};

const getGasPrice = async () => {
  return alchemyClient.core.getGasPrice();
  // return web3.eth.getGasPrice();
};

export default async function handler(req, res) {
  try {
    let balance = await run("check-balance"); // reutrn s Bignumber

    // let transaction = {
    //   to: "0x31B98D14007bDEe637298086988A0bBd31184523", // faucet address to return eth
    //   value: 10,
    //   gasLimit: "21000",
    //   maxFeePerGas: Utils.parseUnits("20", "gwei"),
    //   nonce: nonce,
    //   type: 2,
    //   chainId: 5,
    // };

    // const txBase = {
    //   ...transaction,
    //   from: "0x14daa7439c6BdeeAf5c42C5751Fc0B070af57766",
    //   nonce: await getNonce(),
    //   gasPrice: await getGasPrice(),
    //   chainId: this.chainID,
    // };
    // console.log(utils);
    // console.log(
    //   "initial balance variable:",
    //   typeof balance,
    //   balance,
    //   parseInt(balance),
    // );
    balance = ethers.BigNumber.from(balance);
    // console.log("balance:", balance);
    const gasPrice = await getGasPrice();
    const estimatedGas = await estimateGas();
    // console.log("gasPrice:", gasPrice);
    // console.log("gwei:", ethers.utils.formatUnits(gasPrice, "gwei"));
    const data = {
      balance: ethers.utils.formatUnits(balance, "gwei"),
      nonce: await getNonce(),
      estimatedGas: estimatedGas.toNumber(),
      gasPrice: ethers.utils.formatUnits(gasPrice, "gwei"),
      cost: ethers.utils.formatUnits(estimatedGas * gasPrice, "gwei"),
      feesHistory: await getAllFees(),
      // fees: fetchFees(gasPrice),
      // heesHistory: await fetchHistoryFees(),
    };

    res.status(200).json({
      status: STATUS_OK_TEXT,
      ...data,
    });
  } catch (e) {
    let message = e.message;
    if (typeof e.message !== "string") {
      message = e;
    } else if (e.body) {
      message = JSON.parse(e.body);
    }

    return res.status(500).json({
      status: STATUS_NOK_TEXT,
      error: message,
    });
  }
}
