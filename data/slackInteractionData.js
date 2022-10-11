import { ACTION_DOWNVOTE, ACTION_SEPARATOR, ACTION_UPVOTE } from "@/lib/slack";
import { faunaDbClient, query } from "@/services/faunaDbClient";
import { slackClient } from "@/services/slackClient";
import { downvoteHeadline, upvoteHeadline } from "data/headlineData";

export const addInteraction = async (data) => {
  const { actions, response_url, user } = data;

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

  slackClient.post(response_url, { body: { test: "Thanks for voting!" } });

  const logResult = faunaDbClient.query(
    query.Create(query.Collection("slack-interaction"), { data: { id, action, user: user.username, response_url } })
  );
  return { result, logResult };
};
