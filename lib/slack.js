import { sendSlackData } from "@/lib/slackData";
// import md5 from "md5";

export const ACTION_SEPARATOR = "|";
export const ACTION_UPVOTE_HEADLINE = "upvote-headline";
export const ACTION_DOWNVOTE_HEADLINE = "downvote-headline";
export const ACTION_SELECT_HEADLINE = "select-headline";
export const ACTION_UPVOTE_ART = "upvote-art";
export const ACTION_DOWNVOTE_ART = "downvote-art";
export const ACTION_SELECT_ART = "select-art";

export const PROCESS_HEADLINE_VOTE_ENDTIME = "11:15";
export const PROCESS_HEADLINE_SELECT_ENDTIME = "11:30";
export const PROCESS_ART_VOTE_ENDTIME = "11:45";
export const PROCESS_ART_SELECT_ENDTIME = "12:00";

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

const imageBlock = ({ imageUrl, headline }) => ({
  type: "image",
  image_url: imageUrl,
  alt_text: headline,
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

const voteBlock = (upActionId, downActionId) => ({
  type: "actions",
  elements: [
    {
      type: "button",
      action_id: upActionId,
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
      action_id: downActionId,
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
const selectBlock = (actionId) => ({
  type: "actions",
  elements: [
    {
      type: "button",
      action_id: actionId,
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

export const postVoteHeadlineAction = async (headlines) => {
  const blocks = [];
  blocks.push(headerBlock("Time to Vote Headline:"));
  blocks.push(
    mdBlock(
      `You have until ${PROCESS_HEADLINE_VOTE_ENDTIME}! \n _Its OK to vote multiple times_ \n See the <https://canvas-today.netlify.app/headlines|Voting Results Here>`,
    ),
  );
  headlines.forEach((headline) => {
    blocks.push(textBlock(headline.headline));
    blocks.push(
      voteBlock(
        `${ACTION_UPVOTE_HEADLINE}${ACTION_SEPARATOR}${headline.id}`,
        `${ACTION_DOWNVOTE_HEADLINE}${ACTION_SEPARATOR}${headline.id}`,
      ),
    );
  });

  // OBS! Seems like Slack only allows block length of 50 or less...
  return await sendSlackData({
    data: {
      text: "Todays AI Canvas - Vote Headline Action required:",
      blocks: blocks.slice(0, 50),
    },
  });
};

export const postSelectHeadlineAction = async (topVoted) => {
  const blocks = [];
  blocks.push(headerBlock("Time to Select Headline:"));
  blocks.push(
    mdBlock(
      `You have until ${PROCESS_HEADLINE_SELECT_ENDTIME}! \n _If none is selected, process will take top-voted by default_ \n _Any click of these buttons will override any previous selected_ \n See the <https://canvas-today.netlify.app/headlines|Selected Result Here>`,
    ),
  );
  blocks.push(devider());
  topVoted.map((headline, idx) => {
    blocks.push(textBlock(headline.headline));
    blocks.push(
      selectBlock(`${ACTION_SELECT_HEADLINE}${ACTION_SEPARATOR}${headline.id}`),
    );
    blocks.push(devider(idx));
  });

  return await sendSlackData({
    data: {
      text: "Todays AI Canvas - Select Headline Action required:",
      blocks,
    },
  });
};

export const postVoteArtAction = async (arts) => {
  const blocks = [];
  blocks.push(headerBlock("Time to Vote Art:"));
  blocks.push(
    mdBlock(
      `Selected Headline: "${arts[0].headline}" \n You have until ${PROCESS_ART_VOTE_ENDTIME}! \n _Its OK to vote multiple times_ \n See the <https://canvas-today.netlify.app/arts|Voting Results Here>`,
    ),
  );
  arts.forEach((art) => {
    blocks.push(imageBlock({ imageUrl: art.imageUrl, headline: art.headline }));
    blocks.push(
      voteBlock(
        `${ACTION_UPVOTE_ART}${ACTION_SEPARATOR}${art.id}`,
        `${ACTION_DOWNVOTE_ART}${ACTION_SEPARATOR}${art.id}`,
      ),
    );
  });

  // OBS! Seems like Slack only allows block length of 50 or less...
  return await sendSlackData({
    data: {
      text: "Todays AI Canvas - Vote Art Action required:",
      blocks: blocks.slice(0, 50),
    },
  });
};

export const postSelectArtAction = async (topVoted) => {
  const blocks = [];
  blocks.push(headerBlock("Time to Select Art:"));
  blocks.push(
    mdBlock(
      `Selected Headline: "${topVoted[0].headline}" \n You have until ${PROCESS_ART_SELECT_ENDTIME}! \n _If none is selected, process will take top-voted by default_ \n _Any click of these buttons will override any previous selected_ \n See the <https://canvas-today.netlify.app/arts|Selected Result Here>`,
    ),
  );
  blocks.push(devider());
  topVoted.map((art, idx) => {
    blocks.push(imageBlock({ imageUrl: art.imageUrl, headline: art.headline }));
    blocks.push(
      selectBlock(`${ACTION_SELECT_ART}${ACTION_SEPARATOR}${art.id}`),
    );
    blocks.push(devider(idx));
  });

  return await sendSlackData({
    data: {
      text: "Todays AI Canvas - Select Art Action required:",
      blocks,
    },
  });
};
