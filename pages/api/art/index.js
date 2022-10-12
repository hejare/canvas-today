import { STATUS_NOK_TEXT, STATUS_OK_TEXT } from "@/services/responseConstants";
import { getAllArts, getArtsToday, getSelectedArts } from "data/artData";

export default async function handler(req, res) {
  const { method, query } = req;
  try {
    let data = {};
    switch (method) {
      // case "POST":
      //   data.result = Array.isArray(body)
      //     ? await addArts(body)
      //     : await addArt(body);
      //   break;
      case "GET":
        if (query.today) {
          data.result = await getArtsToday();
        } else if (query.selected) {
          data.result = await getSelectedArts();
        } else {
          data.result = await getArtsToday();
        }
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
