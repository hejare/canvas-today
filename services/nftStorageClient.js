import { NFTStorage } from "nft.storage";

const apiKey = process.env.NFT_STORAGE_API_KEY;
// const apiBaseUrl = process.env.ALCHEMY_API_BASE_URL;

export const nftStorageClient = new NFTStorage({ token: apiKey });
