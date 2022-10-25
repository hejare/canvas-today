import { STATUS_NOK_TEXT, STATUS_OK_TEXT } from "@/services/responseConstants";
import { run } from "hardhat";

export default async function handler(req, res) {
  const { method, body, query } = req;
  try {
    const data = {};
    switch (method) {
      case "POST":
        const { artId } = body;

        if (query.estimate) {
          data.result = await run("estimate-mint", { artId });
        } else {
          data.result = await run("mint", { artId });
        }

        console.log(
          "mint res:(posible estimated)",
          query.estimate,
          data.result,
        );
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
