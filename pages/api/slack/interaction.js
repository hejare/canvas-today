import { cors, corsMiddleware } from "@/lib/corsMiddleware";
import { STATUS_NOK_TEXT, STATUS_OK_TEXT } from "@/services/responseConstants";
// import { getSelectedArt, setSelectedArt } from "@/data/artData";
import { addLog } from "@/data/logData";
import { addInteraction } from "@/data/slackInteractionData";

// TODO: MOVE TO "trigger" folder and rename the folder

export default async function handler(req, res) {
  await corsMiddleware(req, res, cors);
  const { method, body } = req;
  try {
    let data = {};
    switch (method) {
      // Good for testing localy:
      // case "GET":
      //   const test = await getSelectedArt("345305552548528330");
      //   console.log(test);
      //   break;
      case "POST":
        data.result = await addInteraction(JSON.parse(body.payload));
        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }

    res.status(200).json({
      status: STATUS_OK_TEXT,
      ...data,
    });
  } catch (e) {
    let message = e.message;
    if (typeof e.message !== "string") {
      message = e;
    }

    await addLog({
      where: "api/slack/interaction",
      message: message,
      payload: JSON.parse(body.payload),
    });
    return res.status(500).json({
      status: STATUS_NOK_TEXT,
      error: message,
    });
  }
}
