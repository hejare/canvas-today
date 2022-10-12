import {
  ACTION_DOWNVOTE_ART,
  ACTION_DOWNVOTE_HEADLINE,
  ACTION_SELECT_ART,
  ACTION_SELECT_HEADLINE,
  ACTION_SEPARATOR,
  ACTION_UPVOTE_ART,
  ACTION_UPVOTE_HEADLINE,
} from "@/lib/slack";
import { faunaDbClient, query } from "@/services/faunaDbClient";
import { slackClient } from "@/services/slackClient";
import { downvoteArt, setSelectedArt, upvoteArt } from "data/artData";
import {
  downvoteHeadline,
  setSelectedHeadline,
  upvoteHeadline,
} from "data/headlineData";
import { addLog } from "data/logData";

export const addInteraction = async (data) => {
  const { actions, response_url, user } = data;
  const username = user?.username || "no-username";
  const [action, id] = actions[0].action_id.split(ACTION_SEPARATOR);

  let result;
  switch (action) {
    case ACTION_UPVOTE_HEADLINE:
      result = await upvoteHeadline(id);
      break;
    case ACTION_DOWNVOTE_HEADLINE:
      result = await downvoteHeadline(id);
      break;
    case ACTION_SELECT_HEADLINE:
      result = await setSelectedHeadline(id);
      break;
    case ACTION_UPVOTE_ART:
      result = await upvoteArt(id);
      break;
    case ACTION_DOWNVOTE_ART:
      result = await downvoteArt(id);
      break;
    case ACTION_SELECT_ART:
      result = await setSelectedArt(id);
      break;
    default:
      throw new Error(`Unsupported action: ${action}`);
  }

  // Ignore this functionality for now - it replaces the vote-slack with the text sent to response_url
  // if (response_url) {
  //   // Do this, but async:
  //   setTimeout(async () => {
  //     try {
  //       await slackClient.post(response_url, {
  //         body: { text: "Thanks for voting!" },
  //       });
  //     } catch (e) {
  //       addLog({
  //         where: "slackInteractionData/post response",
  //         message: e.message,
  //         response_url,
  //       });
  //     }
  //   }, 500);
  // }

  const logResult = faunaDbClient.query(
    query.Create(query.Collection("slack-interaction"), {
      data: { id, action, user: username, response_url },
    }),
  );
  return { result, logResult };
};
