import { getToday } from "@/lib/common";
import { fetchHeadline } from "@/lib/canvasToday";
import { appendHeadlines } from "@/data/headlineData";
import { STATUS_NOK_TEXT, STATUS_OK_TEXT } from "@/services/responseConstants";

export default async function handler(req, res) {
  const today = getToday();
  let meta = {
    timestamp: Date.now(),
    today,
  };

  try {
    res.status(200).json({
      status: STATUS_OK_TEXT,
      meta: meta,
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
      meta: meta,
    });
  }
}
