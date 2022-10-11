import { sendSlackData } from "@/lib/slackData";
// import md5 from "md5";

const headerBlock = (headline) => ({
  type: "header",
  text: {
    type: "plain_text",
    text: headline,
  },
});

// eslint-disable-next-line no-unused-vars
const textBlock = (text) => ({
  type: "header",
  text: {
    type: "plain_text",
    text: text,
  },
});

const mdBlock = (text) => ({
  type: "section",
  text: {
    type: "mrkdwn",
    text: text,
  },
});

// eslint-disable-next-line no-unused-vars
const textAndButtonSectionBlock = ({ text, buttonText, url, style }) => ({
  type: "section",
  text: {
    type: "mrkdwn",
    text: text,
  },
  accessory: {
    type: "button",
    text: {
      type: "plain_text",
      text: buttonText,
    },
    url: url,
    style: style || "primary",
  },
});

// eslint-disable-next-line no-unused-vars
const actionsBlock = ({ text, buttonText, url, style }) => ({
  type: "actions",
  elements: [
    {
      type: "button",
      text: {
        type: "plain_text",
        emoji: true,
        text: ":thumbsup:",
      },
      style: "primary",
      value: "+1",
    },
    {
      type: "button",
      text: {
        type: "plain_text",
        emoji: true,
        text: ":thumbsdown:",
      },
      style: "danger",
      value: "-1",
    },
  ],
});

const devider = () => ({
  type: "divider",
  block_id: "divider1",
});

export const postHeadlinesSlackForVoting = async (headlines) => {
  const blocks = [];
  blocks.push(headerBlock("Time to vote:"));
  blocks.push(mdBlock("_Its OK to vote multiple times_"));
  blocks.push(devider());
  headlines.map(headline => {

    blocks.push(actionsBlock({ text: headline.headline, url: `https://canvas-today.netlify.app/api/headline/${headline.id}/upvote`, buttonText: "Vote Up" }));
    // blocks.push(textAndButtonSectionBlock({ text: headline.headline, url: `https://canvas-today.netlify.app/api/headline/${headline.id}/upvote`, buttonText: "Vote Up" }));

  });
  console.log(blocks);
  return await sendSlackData({
    data: {
      text: "Todays AI Canvas - Action required:",
      blocks,
    },
  });
};

