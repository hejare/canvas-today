import { getToday } from "@/lib/common";
import {
  filterHeadlines,
  getNewsHeadlines,
  headlineRegex,
} from "@/lib/newsData";
import {
  createPrompt,
  getUrlResponse,
  sendReplicateData,
} from "@/lib/replicateData";
import { addArt, updateArt } from "@/data/artData";
import { addImageBlock, sendSlackData } from "./slackData";

const replicateApiBaseUrl =
  process.env.REPLICATE_API_BASE_URL + process.env.REPLICATE_API_MODEL;

export const ART_AI_VERSION = "1.0.0"; // Our definition
export const ART_AI_MODEL = process.env.REPLICATE_MODEL;
export const ART_AI_MODEL_VERSION = process.env.REPLICATE_MODEL_VERSION;

export const fetchHeadline = async () => {
  const originalHeadlines = await getNewsHeadlines();
  const filteredHeadlines = filterHeadlines(originalHeadlines);
  if (!filteredHeadlines || filteredHeadlines.length === 0) {
    throw new Error("Failed to extract a headline");
  }
  return {
    original: originalHeadlines,
    headlineRegex: headlineRegex.toString(),
    filtered: filteredHeadlines,
    headline: filteredHeadlines[0],
  };
};

const inititateImageGeneration = async (headline, version) => {
  const prompt = createPrompt(headline, version);

  const replicateResp = await sendReplicateData({ prompt });
  if (!replicateResp.urls?.get) {
    throw new Error("Replicate response does not contain urls or urls.get");
  }
  const imageIdentifier = replicateResp.urls.get.replace(
    replicateApiBaseUrl + "/",
    "",
  );

  return addArt({
    date: getToday(),
    headline,
    prompt,
    imageIdentifier,
    imageUrl: "",
    seed: "",
    version: ART_AI_VERSION,
    model: ART_AI_MODEL,
    modelVersion: ART_AI_MODEL_VERSION,
    deleted: false,
    selected: false,
    votes: 0,
  });
};

export const generateArts = async (headline, nrOfAlternatives = 1) => {
  const promises = [];
  const artists = ["Alan Lee", "Claude Monet"];
  let k = 0;
  while (k < artists.length) {
    const artist = artists[k];
    for (let i = 0; i < nrOfAlternatives; i++) {
      promises.push(inititateImageGeneration(headline, artist));
    }
    k++;
  }
  return await Promise.all(promises);
};

export const updateArtsWithoutImageUrl = async (arts) => {
  const results = await Promise.all(
    arts.map((art) => getUrlResponse(art.imageIdentifier)),
  );

  return await Promise.all(
    results.map(({ imageUrl, seed }, idx) => {
      arts[idx].imageUrl = imageUrl;
      arts[idx].seed = seed;
      return updateArt(arts[idx].id, arts[idx]);
    }),
  );
};

export const postDailySlackPost = async ({
  imageUrl,
  headline,
  storedMetadata,
}) => {
  let blocks = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "Todays AI generated Canvas brings You:",
      },
    },
    {
      type: "divider",
      block_id: "divider1",
    },
  ];
  blocks = addImageBlock({ blocks, imageUrl, title: headline });

  blocks.push({
    type: "section",
    text: {
      type: "mrkdwn",
      text: `The Headline: _"${headline}"_ is the essence of what guided the AI to create this masterpiece.`,
    },
  });
  blocks.push({
    type: "section",
    text: {
      type: "mrkdwn",
      text: "*Hurry up and add this to Your NFT collection:* :point_right:",
    },
    accessory: {
      type: "button",
      text: {
        type: "plain_text",
        text: "Mint NFT",
      },
      url: "https://canvas-today.netlify.app",
      style: "primary",
    },
  });
  blocks.push({
    type: "section",
    text: {
      type: "mrkdwn",
      text: `_IPFS Meta url:_ 
      ${storedMetadata.url}`,
    },
  });

  return await sendSlackData({
    data: {
      text: "Todays AI Canvas brings You",
      blocks,
    },
  });
};
