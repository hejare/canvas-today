import { getAllHistory } from "@/lib/historyData";

export default async function handler(req, res) {
  try {
    const history = await getAllHistory();

    res.status(200).json({
      status: "ok",
      history: history,
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
