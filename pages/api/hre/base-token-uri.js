import { STATUS_NOK_TEXT, STATUS_OK_TEXT } from "@/services/responseConstants";
import { run } from "hardhat";

export default async function handler(req, res) {
  const { method, body } = req;
  const { baseTokenUri } = body;
  try {
    let data = {};
    switch (method) {
      case "PUT":
        data.result = await run("set-base-token-uri", {
          baseUrl: baseTokenUri,
        });
        break;
      case "GET":
        data.result = await run("get-base-token-uri");
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
