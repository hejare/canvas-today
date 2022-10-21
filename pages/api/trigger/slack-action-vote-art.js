import { getToday } from "@/lib/common";
import { cors, corsMiddleware } from "@/lib/corsMiddleware";
import { postVoteArtAction } from "@/lib/slack";
import { STATUS_NOK_TEXT, STATUS_OK_TEXT } from "@/services/responseConstants";
import { getArtsToday } from "@/data/artData";
import { addLog } from "@/data/logData";

export default async function handler(req, res) {
  await corsMiddleware(req, res, cors);

  const today = getToday();
  let meta = {
    timestamp: Date.now(),
    today,
  };
  try {
    const todaysArts = await getArtsToday();
    meta.arts = todaysArts;
    const postSuccessful = await postVoteArtAction(todaysArts);
    if (postSuccessful) {
      // TODO: Store status?
    }

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

    await addLog({
      where: "api/art/slack-action-vote",
      message: message,
      meta,
    });
    return res.status(500).json({
      status: STATUS_NOK_TEXT,
      error: message,
      meta: meta,
    });
  }
}
