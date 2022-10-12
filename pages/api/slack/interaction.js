import { cors, corsMiddleware } from "@/lib/corsMiddleware";
import { addLog } from "data/logData";
import { addInteraction } from "data/slackInteractionData";

export default async function handler(req, res) {
  await corsMiddleware(req, res, cors);
  const { method, body } = req;
  try {
    let data = {};
    switch (method) {
      case "POST":
        data.result = await addInteraction(JSON.parse(body.payload));
        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }

    res.status(200).json({
      status: "ok",
      ...data,
    });
  } catch (e) {
    let message = e.message;
    if (typeof e.message !== "string") {
      message = e;
    }

    await addLog({ where: "api/slack/interaction", message: message, payload: JSON.parse(body.payload) });
    return res.status(500).json({
      status: "nok",
      error: message,
    });
  }
}
