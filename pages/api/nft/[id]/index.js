import { getMetadataFromIpfsUrl } from "@/lib/ipfs";
import { STATUS_NOK_TEXT, STATUS_OK_TEXT } from "@/services/responseConstants";
import { getNft, updateNft } from "@/data/nftData";

export default async function handler(req, res) {
  const { method, query, body } = req;
  const { id } = query;
  try {
    let data = {};
    switch (method) {
      case "PUT":
        data.result = await updateNft(id, body);
        break;
      case "GET":
        data.result = await getNft(id);
        if (data.result.ipfsUrl) {
          // TODO: I do not thin k I want to do this here...
          data.result.meta = await getMetadataFromIpfsUrl(data.result.ipfsUrl);
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

    let status = 500;
    if (message.includes("instance not found")) {
      status = 404;
    }

    return res.status(status).json({
      status: STATUS_NOK_TEXT,
      error: message,
    });
  }
}
