import { getToday } from "@/lib/common";
import { fetchHeadline, inititateImageGeneration, postDailySlackPost } from "../../lib/canvasToday";

const ALREADY_GENERATED = "ALREADY_GENERATED";
const history = {}; // Used for preventing spam etc
export default async function handler(req, res) {
  const today = getToday();
  let meta = {
    timestamp: Date.now(),
    today,
  };
  try {
    const force = typeof req.query["force"] !== "undefined";
    const useMock = typeof req.query["use-mock"] !== "undefined";

    if (!force && history[today]) {
      throw new Error(ALREADY_GENERATED);
    }

    const { headline, original, filtered, headlineRegex } = await fetchHeadline();
    meta.headlines = { headline, original, filtered, headlineRegex };

    const { imageUrl, seed, prompt } = await inititateImageGeneration({ inputPrompt: headline, useMock });
    meta.imageUrl = imageUrl;
    meta.seed = seed;
    meta.prompt = prompt;

    const postSuccessful = await postDailySlackPost({ imageUrl, headline });
    if (postSuccessful) {
      history[today] = meta;
    }
  } catch (e) {
    let message = e.message;
    if (e.message === ALREADY_GENERATED) {
      meta = history[today];
      message = "Todays canvas has already been created";
    } else {
      message = e;
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
