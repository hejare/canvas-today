import { STATUS_NOK_TEXT, STATUS_OK_TEXT } from "@/services/responseConstants";
import { deleteArt, getArt, updateArt } from "@/data/artData";
import { updateArtsWithoutImageUrl } from "@/lib/canvasToday";

export default async function handler(req, res) {
  const { method, query, body } = req;
  const { id, updateUncompleted } = query;
  try {
    let data = {};
    switch (method) {
      case "PUT":
        data.result = await updateArt(id, body);
        break;
      case "GET":
        const art = await getArt(id);
        data.result = art;
        if (updateUncompleted && !data.result?.imageUrl) {
          const [updated] = await updateArtsWithoutImageUrl([art]);
          data.result = updated.data;
        }
        break;
      case "DELETE":
        data.result = await deleteArt(id);
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
