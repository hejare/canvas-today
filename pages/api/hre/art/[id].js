import { STATUS_NOK_TEXT, STATUS_OK_TEXT } from "@/services/responseConstants";
import { run } from "hardhat";

export default async function handler(req, res) {
  const { method, query } = req;
  const { id } = query;
  try {
    const data = {};
    switch (method) {
      case "GET":
        data.result = await run("get-art", { artId: id });
        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }

    res.status(200).json({
      status: STATUS_OK_TEXT,
      ...data,
    });
  } catch (e) {
    console.log(e);
    let message = e.message;
    if (typeof e.message !== "string") {
      message = e;
    } else if (e.body) {
      message = JSON.parse(e.body);
    }

    console.log(message);
    let status = 500;
    if (message.includes("Art does not exist")) {
      status = 404;
    }
    return res.status(status).json({
      status: STATUS_NOK_TEXT,
      error: message,
    });
  }
}
