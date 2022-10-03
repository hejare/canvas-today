import md5 from "md5";

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
export const addImageBlock = ({
    blocks = [],
    imageUrl,
    title,
    alt,
  }) => {
  blocks.push({
    type: "image",
    title: {
      type: "plain_text",
      text: title,
    },
    block_id: md5(imageUrl),
    image_url: imageUrl,
    alt_text: alt || title,
  });
  return blocks;
};

