import { runDailySlackPost } from "../../lib/canvasToday"

export default async function handler( req, res ) {
  try {
    await runDailySlackPost();
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
