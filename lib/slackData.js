import { slackClient } from "@/services/slackClient";
import md5 from "md5";

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

export const sendSlackData = ({ data }) => {
  return slackClient.post("", { body: { ...data } });
};

