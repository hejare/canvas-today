import { addImageBlock } from "./slackData";
import { slackClient } from "../services/slackClient";
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
export const runDailySlackPost = () => {
  let blocks = [];
  const imageUrl = "https://i.ytimg.com/vi/IZzcBk6Yzp4/maxresdefault.jpg";
  blocks = addImageBlock({blocks, imageUrl, title: "This is from the server"});
  return sendSlackData({data: {blocks}});
};


export const sendSlackData = ({data}) => {
  return slackClient.post("", { body: { ...data } });
};
