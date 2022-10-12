import { deleteArt, getArt, setArt } from "data/artData";

export default async function handler(req, res) {
  const { method, query, body } = req;
  const { id } = query;
  try {
    let data = {};
    switch (method) {
      case "PUT":
        data.result = await setArt(id, body);
        break;
      case "GET":
        data.result = await getArt(id);
        break;
      case "DELETE":
        data.result = await deleteArt(id);
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

    return res.status(500).json({
      status: "nok",
      error: message,
    });
  }
}
