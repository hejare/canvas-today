import { STATUS_NOK_TEXT, STATUS_OK_TEXT } from "@/services/responseConstants";
import { getAllArts, getArtsByDate, getSelectedArts } from "@/data/artData";
import { getHeadline } from "@/data/headlineData";
import {
  // generateArt,
  generateArtByPrompt,
  getArtPrompt,
} from "@/lib/canvasToday";
import { getToday } from "@/lib/common";

export default async function handler(req, res) {
  const { method, query, body } = req;
  try {
    let data = {};
    switch (method) {
      case "GET":
        const {
          today,
          selected,
          date,
          prompt,
          headlineId: headlineId2,
        } = query;
        if (today) {
          data.result = await getArtsByDate(getToday());
        } else if (date) {
          data.result = await getArtsByDate(date);
        } else if (selected) {
          data.result = await getSelectedArts();
        } else if (prompt) {
          const headline = await getHeadline(headlineId2);
          data.result = await getArtPrompt(headline.headline);
          data.result.headline = headline.headline;
        } else {
          data.result = await getAllArts();
        }
        break;
      case "POST":
        const { headlineId, prompt: prompt2, seed, engine } = body;

        /*
        // Only generate via headlineId:
        data.headlineId = headlineId;
        const headline = await getHeadline(headlineId);
        data.headline = headline;
        const result = await generateArt(headline.headline);
        data.artId = result.id;
        data.imageIdentifier = result.imageIdentifier;
        // data.imageUrl = result.imageUrl;
        // data.modelVersion = result.modelVersion;
        // data.prompt = result.prompt;
        // data.seed = result.seed;
        */

        const result = await generateArtByPrompt({
          prompt: prompt2,
          seed,
          engine,
        });
        data.artId = result.id;
        data.imageIdentifier = result.imageIdentifier;

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

    return res.status(500).json({
      status: STATUS_NOK_TEXT,
      error: message,
    });
  }
}
