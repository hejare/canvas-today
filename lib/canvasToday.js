import { filterHeadlines, getNewsHeadlines, headlineRegex } from "@/lib/newsData";
import { createPrompt, getReplicateImage, sendReplicateData } from "@/lib/replicateData";
import { addImageBlock, sendSlackData } from "./slackData";

const replicateApiBaseUrl = process.env.REPLICATE_API_BASE_URL;

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

export const inititateImageGeneration = async ({ inputPrompt, useMock }) => {
  const prompt = createPrompt(inputPrompt);

  if (useMock) {
    return {
      imageUrl: "https://replicate.com/api/models/stability-ai/stable-diffusion/files/e280a70a-3219-42f7-9eef-567e9da4d0f5/out-0.png",
      prompt,
      seed: "noop",
    };
  }

  const replicateResp = await sendReplicateData({ prompt });
  if (!replicateResp.urls?.get) {
    throw new Error("Replicate response does not contain urls or urls.get");
  }
  const getUrl = replicateResp.urls.get.replace(replicateApiBaseUrl, "");
  const { imageUrl, seed } = await getReplicateImage(getUrl, true);

  return { imageUrl, prompt, seed };
};

export const postDailySlackPost = ({ imageUrl, headline }) => {
  let blocks = [{
    type: "header",
    text: {
      type: "plain_text",
      text: "Todays AI generated Canvas brings You:",
    },
  },
  {
    type: "divider",
    block_id: "divider1",
  }];
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
  return sendSlackData({
    data: {
      text: "Todays AI Canvas brings You",
      blocks,
    },
  });
};

