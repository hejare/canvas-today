import { run } from "hardhat";

export default async function handler(req, res) {
  try {
    const metadataUrl = await run("get-base-token-uri");
    res.status(200).json({
      status: "ok",
      metadataUrl: metadataUrl,
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
