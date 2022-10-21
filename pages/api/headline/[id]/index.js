import { STATUS_NOK_TEXT, STATUS_OK_TEXT } from "@/services/responseConstants";
import { deleteHeadline, getHeadline, setHeadline } from "@/data/headlineData";
import { cors, corsMiddleware } from "@/lib/corsMiddleware";

export default async function handler(req, res) {
  await corsMiddleware(req, res, cors);

  const { method, query, body } = req;
  const { id } = query;
  try {
    let data = {};
    switch (method) {
      case "PUT":
        data.result = await setHeadline(id, body);
        break;
      case "GET":
        data.result = await getHeadline(id);
        break;
      case "DELETE":
        data.result = await deleteHeadline(id);
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
