import { updateArtsWithoutImageUrl } from "@/lib/canvasToday";
import { getToday } from "@/lib/common";
import { cors, corsMiddleware } from "@/lib/corsMiddleware";
import { STATUS_NOK_TEXT, STATUS_OK_TEXT } from "@/services/responseConstants";
import { getArtsWithoutImageUrl } from "data/artData";
import { addLog } from "data/logData";

export default async function handler(req, res) {
  await corsMiddleware(req, res, cors);

  const today = getToday();
  let meta = {
    timestamp: Date.now(),
    today,
  };
  try {
    const uncompleted = await getArtsWithoutImageUrl();
    meta.nrOfUncompleted = uncompleted.length;
    if (uncompleted.length > 0) {
      meta.result = await updateArtsWithoutImageUrl(uncompleted);
    }

    // if (postSuccessful) {
    //   // TODO: Store status?
    // }

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

    await addLog({ where: "api/art/generate", message: message, meta });
    return res.status(500).json({
      status: STATUS_NOK_TEXT,
      error: message,
      meta: meta,
    });
  }
}
