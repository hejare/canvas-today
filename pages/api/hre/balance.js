import { STATUS_NOK_TEXT, STATUS_OK_TEXT } from "@/services/responseConstants";
import { run } from "hardhat";
import { ethers } from "hardhat/internal/lib/hardhat-lib";

export default async function handler(req, res) {
  try {
    let balance = await run("check-balance"); // reutrns Bignumber

    balance = ethers.BigNumber.from(balance);

    const data = {
      balance: ethers.utils.formatUnits(balance, "gwei"),
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
