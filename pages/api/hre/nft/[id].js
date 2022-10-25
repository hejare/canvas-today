import { getMetadataFromIpfsUrl } from "@/lib/ipfs";
import { STATUS_NOK_TEXT, STATUS_OK_TEXT } from "@/services/responseConstants";
import { run } from "hardhat";

export default async function handler(req, res) {
  const { method, query } = req;
  const { id } = query;
  try {
    let data = {};
    switch (method) {
      case "GET":
        console.log("get nft, tokenId:", id);

        const metaUri = await run("token-uri", { tokenId: id });
        console.log("get nft meta, metaUri:", metaUri);

        if (metaUri) {
          data.result.meta = await getMetadataFromIpfsUrl(data.result.ipfsUrl);
          console.log("get nft meta, data:", data.result.meta);
        }

        if (query.count && data.result.meta.artId) {
          const art = await run("get-art", { artId: data.result.meta.artId });
          console.log("get nft art, art:", art);
          data.result.mintedCount = art[0];
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

    return res.status(500).json({
      status: STATUS_NOK_TEXT,
      error: message,
    });
  }
}
