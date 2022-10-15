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
export const storeFile = async ({ imageUrl, props, useMock }) => {
  if (useMock) {
    return {
      ipnft: "bafyreiaj2c7zx3b3yajdgj7cnze6vuyf54xqlkp3z5qhvtwvtjzea73hre",
      url: "ipfs://bafyreiaj2c7zx3b3yajdgj7cnze6vuyf54xqlkp3z5qhvtwvtjzea73hre/metadata.json",
    };
  }
  const res = await fetch(imageUrl);

  if (res.status > 399) {
    throw new Error(
      `Fetching file fails. Perhaps unexisting? status=${res.status}`,
    );
  }

  // [EIP-721]: image: "A URI pointing to a resource with mime type image/* representing the asset to which this NFT represents. Consider making any images at a width between 320 and 1080 pixels and aspect ratio between 1.91:1 and 4:5 inclusive."
  const imageFile = new File([await res.buffer()], "nft.png", {
    type: "image/png",
  });

  const { date, headline, seed, artId, prompt, version, model, modelVersion } =
    props;
  const metadata = await nftStorageClient.store({
    name: `Canvas Today #${counter}`,
    description: `The Headline: _"${headline}"_ is the essence of what guided the AI to create this masterpiece.`,
    image: imageFile,
    properties: {
      custom:
        "Any custom data can appear in properties, files are automatically uploaded.",
      file: imageFile,
    },
    external_url: "TODO", // TODO, like https://canvas-today.netlify.app/nft/[id]
    //background_color: "#000000", // color used behind image in OpenSea
    seller_fee_basis_points: 100, // Indicates a 1% seller fee.
    fee_recipient: process.env.FEE_RECIPIENT_ADDRESS, // Where seller fees will be paid to.
    attributes: [
      {
        display_type: "text",
        trait_type: "Headline",
        value: headline,
      },
      {
        display_type: "text",
        trait_type: "AI Prompt",
        value: prompt,
      },
      {
        display_type: "date",
        trait_type: "Headline Date",
        value: date, // timestamp / 1000,
      },
      {
        display_type: "text",
        trait_type: "AI Generation data",
        value: seed,
      },
      {
        display_type: "number",
        trait_type: "Generation",
        value: version, // Thought: could be increased every time we make changes in the AI-generating logics, like prompt or AI-version
      },
      {
        display_type: "number",
        trait_type: "Art id",
        value: artId,
      },
      {
        display_type: "text",
        trait_type: "AI model",
        value: model,
      },
      {
        display_type: "text",
        trait_type: "AI model version",
        value: modelVersion,
      },

      /*
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
      */
    ],
  });

  // console.log(metadata); // returns Token {ipnfs: ..., url: "ipfs://..."}
  // console.log(metadata.data); // returns all meta
  // console.log(metadata.embed()); // returns all meta, but "processed", for example: metadata.embed().href is a http-image url

  return {
    cid: metadata.ipnft,
    url: metadata.url,
    ...metadata.embed(),
  };
};

export const getMetadataFromIpfsUrl = async (ipfsUrl) => {
  // "ipfs://bafyreigw72jsonjq5i72muquvcfcw4a5a6gahlgwnjqkvi2ufeq56ogjdy/metadata.json"
  return await ipfsProxyClient.get(ipfsUrl);
};

export const getImageFromIpfsImageUrl = async (ipfsImageUrl) => {
  // "ipfs://bafybeifnzdpimfbua7hzo7mgwrkf3wwz6brreoau367knfytmwqpw55k3y/nft.png"
  return await ipfsProxyClient.getRaw(ipfsImageUrl);
};
