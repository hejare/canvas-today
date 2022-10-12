import { STATUS_NOK_TEXT, STATUS_OK_TEXT } from "@/services/responseConstants";
import { run } from "hardhat";

export default async function handler(req, res) {
  try {
    const baseTokenUri =
      "ipfs://bafyreihnjk6g65kxtxdnbryhe7r6nbrfyl3iceyy4me24avg6dd2uhfkzm/metadata.json"; // TODO: get from where?
    const transactionResponse = await run("set-base-token-uri", {
      baseUrl: baseTokenUri,
    });
    res.status(200).json({
      status: STATUS_OK_TEXT,
      transactionResponse: transactionResponse,
      txHAsh: transactionResponse.hash,
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
