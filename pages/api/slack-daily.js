import { inititateImageGeneration, runDailySlackPost } from "../../lib/canvasToday"

export default async function handler( req, res ) {
  try {
    const imageUrl = await inititateImageGeneration({prompt: "North Korea fires ballistic missile over Japan"});
    await runDailySlackPost({imageUrl});
  } catch(e) {
    return res.status(500).json({
      status: 'nok',
      timestamp: Date.now(),
      error: e,
    })
  }

  res.status(200).json({
    status: 'ok',
    timestamp: Date.now(),
  })
}
