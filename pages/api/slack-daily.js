import { fetchHeadline, inititateImageGeneration, postDailySlackPost } from "../../lib/canvasToday"

const history = {}; // TODO: To prevent spam etc
export default async function handler( req, res ) {
  const meta = {};
  try {
    const { headline, original, filtered, headlineRegex } = await fetchHeadline();
    meta.headlines = { headline, original, filtered, headlineRegex };
    const imageUrl = await inititateImageGeneration({prompt: headline});
    await postDailySlackPost({imageUrl, headline});
  } catch(e) {
    return res.status(500).json({
      status: 'nok',
      timestamp: Date.now(),
      error: {
        message: e.message,
        ...e
      },
    })
  }

  res.status(200).json({
    status: 'ok',
    timestamp: Date.now(),
    meta: meta
  })
}
