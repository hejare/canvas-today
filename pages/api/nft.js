import {
  getLatestBlock,
  getNfts,
  getOutboundTransfers,
} from "@/lib/alchemyData";
import { STATUS_NOK_TEXT, STATUS_OK_TEXT } from "@/services/responseConstants";

export default async function handler(req, res) {
  try {
    const [latestBlock, nfts, outboundTransfers] = await Promise.all([
      getLatestBlock(),
      getNfts(),
      getOutboundTransfers(),
    ]);

    res.status(200).json({
      status: STATUS_OK_TEXT,
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
      status: STATUS_NOK_TEXT,
      error: message,
    });
  }
}
