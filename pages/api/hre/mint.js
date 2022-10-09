import { run } from "hardhat";

export default async function handler(req, res) {
  try {
    const mintToAddress = process.env.FEE_RECIPIENT_ADDRESS; // TODO: get from input?
    const transactionResponse = await run("mint", { address: mintToAddress });
    res.status(200).json({
      status: "ok",
      transactionResponse: transactionResponse,
      txHash: transactionResponse.hash,
    });
  } catch (e) {
    let message = e.message;
    if (typeof e.message !== "string") {
      message = e;
    } else if (e.body) {
      message = JSON.parse(e.body);
    }

    return res.status(500).json({
      status: "nok",
      error: message,
    });
  }
}
