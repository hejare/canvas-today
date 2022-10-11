import { getToday } from "@/lib/common";
import { cors, corsMiddleware } from "@/lib/corsMiddleware";
import { fetchHeadline } from "../../../lib/canvasToday";
import { appendHeadlines } from "data/headlineData";

export default async function handler(req, res) {
  await corsMiddleware(req, res, cors);

  const today = getToday();
  let meta = {
    timestamp: Date.now(),
    today,
  };
  try {
    const { headline, original, filtered, headlineRegex } =
      await fetchHeadline();
    meta.headlines = { headline, original, filtered, headlineRegex };
    meta.result = await appendHeadlines(filtered);
  } catch (e) {
    let message = e.message;
    if (typeof e.message !== "string") {
      message = e;
    } else if (e.body) {
      message = JSON.parse(e.body);
    }

    return res.status(500).json({
      status: "nok",
      error: message,
      meta: meta,
    });
  }

  res.status(200).json({
    status: "ok",
    meta: meta,
  });
}
