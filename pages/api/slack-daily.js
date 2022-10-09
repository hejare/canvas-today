import { getToday } from "@/lib/common";
import { cors, corsMiddleware } from "@/lib/corsMiddleware";
import { addHistory } from "@/lib/historyData";
import { fetchHeadline, inititateImageGeneration, postDailySlackPost } from "../../lib/canvasToday";
import { storeFile } from "@/lib/ipfs";

const ALREADY_GENERATED = "ALREADY_GENERATED";
const history = {}; // Used for preventing spam etc
export default async function handler(req, res) {
  await corsMiddleware(req, res, cors);

  const today = getToday();
  let meta = {
    timestamp: Date.now(),
    today,
  };
  try {
    const force = typeof req.query["force"] !== "undefined";
    const useMock = typeof req.query["use-mock"] !== "undefined";
    if (useMock) {
      meta.mocked = true;
    }
    if (force) {
      meta.forced = true;
    }
    if (!force && history[today]) {
      throw new Error(ALREADY_GENERATED);
    }

    const { headline, original, filtered, headlineRegex } = await fetchHeadline();
    meta.headlines = { headline, original, filtered, headlineRegex };

    const { imageUrl, seed, prompt } = await inititateImageGeneration({ inputPrompt: headline, useMock });
    meta.imageUrl = imageUrl;
    meta.seed = seed;
    meta.prompt = prompt;

    const props = {
      timestamp: meta.timestamp,
      date: today,
      headline: headline,
      originalImageUrl: imageUrl,
      seed: seed,
      prompt: prompt,
    };
    const storedMetadata = await storeFile({ imageUrl, props, useMock });
    meta.storedMetadata = storedMetadata;

    const postSuccessful = await postDailySlackPost({ imageUrl, headline, storedMetadata });
    if (postSuccessful) {
      // Store to DB:
      await addHistory(meta);

      history[today] = meta; // TODO: Remove in favor for faunaDb
    }
  } catch (e) {
    let message = e.message;
    if (e.message === ALREADY_GENERATED) {
      meta = history[today];
      message = "Todays canvas has already been created";
    } else if (typeof e.message !== "string") {
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
