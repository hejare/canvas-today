import { ACTION_DOWNVOTE, ACTION_SEPARATOR, ACTION_UPVOTE } from "@/lib/slack";
import { faunaDbClient, query } from "@/services/faunaDbClient";
import { slackClient } from "@/services/slackClient";
import { downvoteHeadline, upvoteHeadline } from "data/headlineData";
import { addLog } from "data/logData";

export const addInteraction = async (data) => {
  const { actions, response_url, user } = data;
  const username = user?.username || "no-username";
  const [action, id] = actions[0].action_id.split(ACTION_SEPARATOR);

  let result;
  switch (action) {
    case ACTION_UPVOTE:
      result = await upvoteHeadline(id);
      break;
    case ACTION_DOWNVOTE:
      result = await downvoteHeadline(id);
      break;
    // case "select":
    //   result = await selectHeadline(id);
    //   break;
    default:
      throw new Error(`Unsupported action: ${action}`);
  }

  if (response_url) {
    try {
      slackClient.post(response_url, { body: { test: "Thanks for voting!" } });
    } catch (e) {
      addLog({ where: "slackInteractionData/post", message: e.message, response_url });
    }
  }
  addLog({ where: "slackInteractionData/post", action, id, response_url, username });

  const logResult = faunaDbClient.query(
    query.Create(query.Collection("slack-interaction"), { data: { id, action, user: username, response_url } })
  );
  return { result, logResult };
};
