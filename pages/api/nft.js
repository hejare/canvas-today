import { getLatestBlock, getNfts, getOutboundTransfers } from "@/lib/alchemyData";

export default async function handler(req, res) {
  try {
    const [latestBlock, nfts, outboundTransfers] = await Promise.all([getLatestBlock(), getNfts(), getOutboundTransfers()]);

    res.status(200).json({
      status: "ok",
      nfts: nfts,
      latestBlock: latestBlock,
      outboundTransfers: outboundTransfers,
    });
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
