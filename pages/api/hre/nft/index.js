import { getNfts } from "@/lib/alchemyData";
import { STATUS_NOK_TEXT, STATUS_OK_TEXT } from "@/services/responseConstants";
import { run } from "hardhat";

export default async function handler(req, res) {
  const { method, body } = req;
  try {
    const data = {};
    switch (method) {
      case "POST":
        console.log("body:", body);
        const { artId, metaUrl } = body;
        data.result = await run("add-art", { artId, metaUrl });
        break;
      case "GET":
        data.result = await getNfts();
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
