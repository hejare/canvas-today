import { File, Blob } from "nft.storage";
import { nftStorageClient } from "@/services/nftStorageClient";
import fetch from "node-fetch";
import { ipfsProxyClient } from "@/services/ipfsProxyClient";

export const storeObject = async (meta) => {
  const someData = new Blob([JSON.stringify(meta)]);
  const cid = await nftStorageClient.storeBlob(someData);
  return cid;
};

// "https://replicate.com/api/models/stability-ai/stable-diffusion/files/3e740442-88fb-4794-8fe7-8f4a281f987f/out-0.png"
const counter = "[TBD]"; // TODO!
export const storeFile = async ({ imageUrl, props }) => {
  const res = await fetch(imageUrl);

  if (res.status > 399) {
    throw new Error(`Fetching file fails. Perhaps unexisting? status=${res.status}`);
  }
  const imageFile = new File([await res.buffer()], "nft.png", { type: "image/png" });

  const metadata = await nftStorageClient.store({
    ...props,
    name: `Canvas Today #${counter}`,
    description: `The Headline: _"${props.headline}"_ is the essence of what guided the AI to create this masterpiece.`,
    image: imageFile,
    external_url: "TODO", // TODO, like https://canvas-today.netlify.app/nft/[id]
    /*
    attributes: [
      {
        trait_type: "level",
        value: 3,
      },
      {
        trait_type: "stamina",
        value: 11.7,
      },
      {
        trait_type: "personality",
        value: "sleepy",
      },
      {
        "display_type": "boost_number",
        trait_type: "aqua_power",
        value: 30,
      },
      {
        "display_type": "boost_percentage",
        trait_type: "stamina_increase",
        value: 15,
      },
      {
        "display_type": "number",
        trait_type: "generation",
        value: 1,
      },
    ],
    */
  });
  return metadata;
};

export const getMetadataFromIpfsUrl = async (ipfsUrl) => { // "ipfs://bafyreigw72jsonjq5i72muquvcfcw4a5a6gahlgwnjqkvi2ufeq56ogjdy/metadata.json"
  return await ipfsProxyClient.get(ipfsUrl);
};