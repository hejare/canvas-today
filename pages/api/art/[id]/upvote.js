import { isTimePassed } from "@/lib/common";
import { PROCESS_ART_VOTE_ENDTIME } from "@/lib/slack";
import { STATUS_NOK_TEXT, STATUS_OK_TEXT } from "@/services/responseConstants";
import { upvoteArt } from "@/data/artData";

export default async function handler(req, res) {
  const { method, query } = req;
  const { id } = query;
  try {
    let data = {};

    if (isTimePassed(PROCESS_ART_VOTE_ENDTIME)) {
      return res.status(401).json({
        status: STATUS_NOK_TEXT,
        message: "Voting is closed for today",
      });
    }

    switch (method) {
      case "GET":
        data.result = await upvoteArt(id);
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
