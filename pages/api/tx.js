import { sendTransaction } from "@/lib/alchemyData";

export default async function handler(req, res) {
  try {
    const { tx, nonce, rawTransaction } = await sendTransaction();
    res.status(200).json({
      status: "ok",
      nonce: nonce,
      tx: tx,
      rawTransaction: rawTransaction,
    });
    return;
  } catch (e) {
    let message = e.message;
    if (typeof e.message !== "string") {
      message = e;
    } else if (e.body) {
      message = JSON.parse(e.body);
    }

    return res.status(500).json({
      status: "nok",
      error: message,
    });
  }
}
