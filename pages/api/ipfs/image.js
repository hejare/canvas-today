import { getImageFromIpfsImageUrl } from "@/lib/ipfs";
import { STATUS_NOK_TEXT } from "@/services/responseConstants";

export default async function handler(req, res) {
  const { method, query } = req;
  try {
    switch (method) {
      case "GET":
        const src = query.src;
        if (!src) {
          throw new Error(`Missing param: src`);
        }
        const response = await getImageFromIpfsImageUrl(
          decodeURIComponent(src),
        );
        res.setHeader("Content-Type", "image/png");
        // const imageUrl = "https://www.hejare.se/images/hero-hejare-2.jpeg";
        // const response = await fetch(imageUrl);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        res.send(buffer);
        return;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }
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
