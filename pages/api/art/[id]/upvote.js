import { upvoteArt } from "data/artData";

export default async function handler(req, res) {
  const { method, query } = req;
  const { id } = query;
  try {
    let data = {};
    switch (method) {
      case "GET":
        data.result = await upvoteArt(id);
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
