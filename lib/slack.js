import { sendSlackData } from "@/lib/slackData";
// import md5 from "md5";

export const ACTION_SEPARATOR = "|";
export const ACTION_UPVOTE = "upvote";
export const ACTION_DOWNVOTE = "downvote";

const headerBlock = (headline) => ({
  type: "header",
  text: {
    type: "plain_text",
    text: headline,
  },
});

// eslint-disable-next-line no-unused-vars
const textBlock = (text) => ({
  type: "section",
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
const actionsBlock = ({ id, text, buttonText, url, style }) => ({
  type: "actions",
  elements: [
    {
      type: "button",
      action_id: `${ACTION_UPVOTE}${ACTION_SEPARATOR}${id}`,
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
      action_id: `${ACTION_DOWNVOTE}${ACTION_SEPARATOR}${id}`,
      text: {
        type: "plain_text",
        emoji: true,
        text: ":thumbsdown:",
      },
      style: "danger",
      value: `-1`,
    },
  ],
});

const devider = (number) => ({
  type: "divider",
  block_id: `divider${number || Math.random()}`,
});

export const postHeadlinesSlackForVoting = async (headlines) => {
  const blocks = [];
  blocks.push(headerBlock("Time to vote:"));
  blocks.push(mdBlock("_Its OK to vote multiple times_"));
  blocks.push(devider());
  headlines.map((headline, idx) => {

    blocks.push(textBlock(headline.headline));
    blocks.push(actionsBlock({ text: headline.headline, url: `https://canvas-today.netlify.app/api/headline/${headline.id}/upvote`, buttonText: "Vote Up" }));
    blocks.push(devider(idx));
    // blocks.push(textAndButtonSectionBlock({ text: headline.headline, url: `https://canvas-today.netlify.app/api/headline/${headline.id}/upvote`, buttonText: "Vote Up" }));

  });

  return await sendSlackData({
    data: {
      text: "Todays AI Canvas - Action required:",
      blocks,
    },
  });
};

