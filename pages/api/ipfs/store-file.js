import { storeFile } from "@/lib/ipfs";
import { STATUS_NOK_TEXT, STATUS_OK_TEXT } from "@/services/responseConstants";

export default async function handler(req, res) {
  const { method, body } = req;
  try {
    let data = {};
    switch (method) {
      case "POST":
        const { imageUrl, meta } = body;
        const storeFileResponse = await storeFile({
          imageUrl,
          meta,
          // useMock: true,
        });
        const { url, ipnft } = storeFileResponse;
        data.result = {
          ipfsUrl: url,
          cid: ipnft,
        };
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
