import { sendSlackData } from "@/lib/slackData";
// import md5 from "md5";

export const ACTION_SEPARATOR = "|";
export const ACTION_UPVOTE = "upvote";
export const ACTION_DOWNVOTE = "downvote";
export const ACTION_SELECT = "select";

const PROCESS_SELECT_ENDTIME = "11:30";

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

const votingBlock = (id) => ({
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

// eslint-disable-next-line no-unused-vars
const selectHeadlineBlock = (id) => ({
  type: "actions",
  elements: [
    {
      type: "button",
      action_id: `${ACTION_SELECT}${ACTION_SEPARATOR}${id}`,
      text: {
        type: "plain_text",
        emoji: true,
        text: "Select This",
      },
      style: "primary",
      value: "selected",
    },
  ],
});

const devider = (number) => ({
  type: "divider",
  block_id: `divider${number || Math.random()}`,
});

export const postHeadlinesSlackForVoting = async (headlines) => {
  const blocks = [];
  blocks.push(headerBlock("Time to Vote:"));
  blocks.push(mdBlock("_Its OK to vote multiple times_ \n See the <https://canvas-today.netlify.app/headlines|Voting Results Here>"));
  blocks.push(devider());
  headlines.map((headline, idx) => {
    blocks.push(textBlock(headline.headline));
    blocks.push(votingBlock(headline.id));
    blocks.push(devider(idx));
  });

  return await sendSlackData({
    data: {
      text: "Todays AI Canvas - Voting Action required:",
      blocks,
    },
  });
};

export const postTopVotedHeadlinesSlackToInform = async (topVoted) => {
  const blocks = [];
  blocks.push(headerBlock("Time to Select:"));
  blocks.push(mdBlock(`You have until ${PROCESS_SELECT_ENDTIME}! \n _If none is selected, process will take top-voted by default_ \n _Any click of these buttons will override any previous selected_ \n See the <https://canvas-today.netlify.app/headlines|Selected Result Here>`));
  blocks.push(devider());
  topVoted.map((headline, idx) => {
    blocks.push(textBlock(headline.headline));
    blocks.push(selectHeadlineBlock(headline.id));
    blocks.push(devider(idx));
  });

  return await sendSlackData({
    data: {
      text: "Todays AI Canvas - Select Action required:",
      blocks,
    },
  });
};

