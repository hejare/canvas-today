import { inititateImageGeneration } from "@/lib/canvasToday";
import { getToday } from "@/lib/common";
import { cors, corsMiddleware } from "@/lib/corsMiddleware";
import { getHeadlinesToday, getSelectedHeadline } from "data/headlineData";
import { addLog } from "data/logData";

export default async function handler(req, res) {
  await corsMiddleware(req, res, cors);

  const today = getToday();
  let meta = {
    timestamp: Date.now(),
    today,
  };
  try {
    let headline;
    const selected = await getSelectedHeadline();
    if (selected) {
      headline = selected.headline;
    } else {
      const headlines = await getHeadlinesToday();
      const votedHeadline = headlines.sort((a, b) => b.votes - a.votes)[0];
      meta.topVoted = votedHeadline;
      headline = votedHeadline.headline;
    }

    const result = await inititateImageGeneration(headline);
    meta.result = result;
    // if (postSuccessful) {
    //   // TODO: Store status?
    // }

    res.status(200).json({
      status: "ok",
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
      status: "nok",
      error: message,
      meta: meta,
    });
  }
}
