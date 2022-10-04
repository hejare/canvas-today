import { addImageBlock } from "./slackData";
import { slackClient } from "../services/slackClient";
import { replicateClient } from "@/services/replicateClient";
/*
{
    "blocks": [
		{
			"type": "image",
			"title": {
				"type": "plain_text",
				"text": "Canvas Today"
			},
			"block_id": "image4",
			"image_url": "https://cdn.discordapp.com/attachments/943622331916488704/1022802176776605726/Leo-STHLM_canvas_war_world_e88e17f9-7df7-48cc-b8bb-0bd34f93a41a.png",
			"alt_text": "midjourney canvas war world"
		}
	]
}
*/
const replicateApiBaseUrl = process.env.REPLICATE_API_BASE_URL;
const modelVersion = process.env.REPLICATE_MODEL_VERSION;
let count;
export const inititateImageGeneration = async ({prompt}) => {
  const replicateResp = await sendReplicateData({ prompt });
  // console.log({replicateResp})
  if (!replicateResp.urls?.get) {
    throw new Error("Replicate response does not contain urls or urls.get");
  }
  const getUrl = replicateResp.urls.get.replace(replicateApiBaseUrl, "");
  count = 0;
  const imageUrl = await getReplicateImage(getUrl);
  return imageUrl;
};

export const runDailySlackPost = ({imageUrl}) => {
  let blocks = [];
  // const imageUrl = "https://i.ytimg.com/vi/IZzcBk6Yzp4/maxresdefault.jpg";
  blocks = addImageBlock({blocks, imageUrl, title: "This is from the server"});
  return sendSlackData({data: {blocks}});
};

const getReplicateImage = async (replicateImageIdentifier) => {
  return new Promise(async (resolve, reject) => {
    count++;
    try {
      const retUrlResponse = await replicateClient.get(replicateImageIdentifier);
      if (retUrlResponse.output) {
        return resolve(retUrlResponse.output[0]);
      }
    } catch (e) {
      return reject(e);
    }
    if (count > 10) {
      return reject("Timed out");
    }
    setTimeout(async () => {
      const resp = await getReplicateImage(replicateImageIdentifier).catch(reject);
      resolve(resp)
    }, 1000);
  });
};

const sendReplicateData = ({prompt}) => {
  return replicateClient.post("", {
    body: { 
      version: modelVersion,
      input: {
        prompt: `"Alan Lee" fantasy "oil painting" ${prompt}`
      }
    }
  });
};

const sendSlackData = ({data}) => {
  return slackClient.post("", { body: { ...data } });
};
