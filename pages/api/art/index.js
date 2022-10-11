import { getAllArts, getArtsToday } from "data/artData";

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
        data.result = query.today ? await getArtsToday() : await getAllArts();
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
