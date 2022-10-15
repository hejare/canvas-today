import { STATUS_NOK_TEXT, STATUS_OK_TEXT } from "@/services/responseConstants";
import { addNft, getAllNfts } from "data/nftData";

export default async function handler(req, res) {
  const { method, body } = req;
  try {
    let data = {};
    switch (method) {
      case "POST":
        console.log("body:", body);
        data.result = await addNft(body);
        break;
      case "GET":
        data.result = await getAllNfts();
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
    }

    return res.status(500).json({
      status: STATUS_NOK_TEXT,
      error: message,
    });
  }
}
