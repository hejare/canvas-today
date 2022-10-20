import { STATUS_NOK_TEXT, STATUS_OK_TEXT } from "@/services/responseConstants";
import { run } from "hardhat";

export default async function handler(req, res) {
  const { method, body } = req;
  try {
    const data = {};
    switch (method) {
      case "POST":
        const { artId } = body;
        data.result = await run("mint", { artId });

        // const mintToAddress = process.env.FEE_RECIPIENT_ADDRESS; // TODO: get from input?
        // data.result = await run("mintTo", { artId, address: mintToAddress });

        // temp just checking the meta:
        // const tokenId = data.result;
        // console.log("tokenId:", tokenId);
        // data.result2 = await run("get-nft-meta-by-tokenid", {
        //   tokenId: tokenId, // BigNumber(3),
        // });
        // console.log("result after get meta:", data.result2);

        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }

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
