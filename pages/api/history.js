import { getAllHistory } from "@/lib/historyData";
import { STATUS_NOK_TEXT, STATUS_OK_TEXT } from "@/services/responseConstants";

export default async function handler(req, res) {
  try {
    const history = await getAllHistory();

    res.status(200).json({
      status: STATUS_OK_TEXT,
      history: history,
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
