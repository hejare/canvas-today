import { STATUS_NOK_TEXT, STATUS_OK_TEXT } from "@/services/responseConstants";
import {
  addHeadline,
  addHeadlines,
  getAllHeadlines,
  getHeadlinesToday,
} from "@/data/headlineData";

export default async function handler(req, res) {
  const { method, body, query } = req;
  try {
    let data = {};
    switch (method) {
      case "POST":
        data.result = Array.isArray(body)
          ? await addHeadlines(body)
          : await addHeadline(body);
        break;
      case "GET":
        data.result = query.today
          ? await getHeadlinesToday()
          : await getAllHeadlines();
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
