import { getNfts } from "@/lib/alchemyData";
import { STATUS_NOK_TEXT, STATUS_OK_TEXT } from "@/services/responseConstants";

export default async function handler(req, res) {
  const { method } = req;
  try {
    const data = {};
    switch (method) {
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
