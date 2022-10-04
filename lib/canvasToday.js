import { filterHeadlines, getNews, headlineRegex } from "@/lib/newsData";
import { getReplicateImage, sendReplicateData } from "@/lib/replicateData";
import { addImageBlock, sendSlackData } from "./slackData";

const replicateApiBaseUrl = process.env.REPLICATE_API_BASE_URL;

export const fetchHeadline = async () => {
  const  originalHeadlines = await getNews();
  const filteredHeadlines = filterHeadlines(originalHeadlines);
  if (!filteredHeadlines || filteredHeadlines.length === 0) {
    throw new Error("Failed to extract a headline");
  }
  return {
    original: originalHeadlines,
    headlineRegex: headlineRegex,
    filtered: filteredHeadlines,
    headline: filteredHeadlines[0],
  };
};

export const inititateImageGeneration = async ({prompt}) => {
  const replicateResp = await sendReplicateData({ prompt });
  if (!replicateResp.urls?.get) {
    throw new Error("Replicate response does not contain urls or urls.get");
  }
  const getUrl = replicateResp.urls.get.replace(replicateApiBaseUrl, "");
  const imageUrl = await getReplicateImage(getUrl, true);
  return imageUrl;
};

export const postDailySlackPost = ({imageUrl, headline}) => {
  let blocks = [];
  blocks = addImageBlock({blocks, imageUrl, title: headline});
  return sendSlackData({data: {blocks}});
};

