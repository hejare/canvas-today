import { isTimePassed } from "@/lib/common";
import { PROCESS_HEADLINE_SELECT_ENDTIME } from "@/lib/slack";
import { STATUS_NOK_TEXT, STATUS_OK_TEXT } from "@/services/responseConstants";
import {
  setSelectedHeadline,
  unsetSelectedHeadline,
} from "@/data/headlineData";
import { cors, corsMiddleware } from "@/lib/corsMiddleware";

export default async function handler(req, res) {
  await corsMiddleware(req, res, cors);

  const { method, query } = req;
  const { id } = query;
  try {
    let data = {};

    if (isTimePassed(PROCESS_HEADLINE_SELECT_ENDTIME)) {
      return res.status(401).json({
        status: STATUS_NOK_TEXT,
        message: "Selecting is closed for today",
      });
    }

    switch (method) {
      case "GET":
        data.result = await setSelectedHeadline(id);
        break;
      case "DELETE":
        data.result = await unsetSelectedHeadline(id);
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
