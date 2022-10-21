import { STATUS_NOK_TEXT, STATUS_OK_TEXT } from "@/services/responseConstants";
import { getHeadlineStatus } from "@/data/headlineData";

export default async function handler(req, res) {
  try {
    const status = await getHeadlineStatus();

    res.status(200).json({
      status: STATUS_OK_TEXT,
      headlineStatus: status,
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
