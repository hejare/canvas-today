import { getToday } from "@/lib/common";
import {
  filterHeadlines,
  getNewsHeadlines,
  getNewsHeadlinesFromRss,
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

export const fetchHeadlines = async () => {
  const originalHeadlinesFromRss = await getNewsHeadlinesFromRss();
  const filteredHeadlinesFromRss = filterHeadlines(originalHeadlinesFromRss);

  const originalHeadlines = await getNewsHeadlines();
  const filteredHeadlines = filterHeadlines(originalHeadlines);

  const headlines = filteredHeadlines.concat(filteredHeadlinesFromRss);
  if (!headlines || headlines.length === 0) {
    throw new Error("Failed to extract a headline");
  }
  return {
    original: originalHeadlines,
    originalRss: originalHeadlinesFromRss,
    headlineRegex: headlineRegex.toString(),
    filtered: headlines,
  };
};

const inititateImageGeneration = async ({ prompt, seed, headline }) => {
  const replicateResp = await sendReplicateData({ prompt, seed });
  if (!replicateResp.urls?.get) {
    throw new Error("Replicate response does not contain urls or urls.get");
  }
  const imageIdentifier = replicateResp.urls.get.replace(
    replicateApiBaseUrl + "/",
    "",
  );

  return addArt({
    date: getToday(),
    headline, // wil be undefined for manual editing prompt
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

export const ARTISTST = ["Alan Lee", "Claude Monet"];
export const DEFAULT_VERSION = ARTISTST[0];
export const generateArt = async (headline, artist = DEFAULT_VERSION) => {
  const prompt = createPrompt(headline, artist);
  return await inititateImageGeneration({ prompt, headline });
};

export const generateArtByPrompt = async ({ prompt, seed, engine }) => {
  return await inititateImageGeneration({ prompt, seed });
};

export const generateArts = async (headline, nrOfAlternatives = 1) => {
  const promises = [];
  let k = 0;
  while (k < ARTISTST.length) {
    const artist = ARTISTST[k];
    for (let i = 0; i < nrOfAlternatives; i++) {
      const prompt = createPrompt(headline, artist);
      promises.push(inititateImageGeneration({ prompt, headline }));
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

export const getArtPrompt = (headline) => {
  return {
    prompt: createPrompt(headline, DEFAULT_VERSION),
    version: DEFAULT_VERSION,
  };
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
