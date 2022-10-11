import { ACTION_DOWNVOTE, ACTION_SELECT, ACTION_SEPARATOR, ACTION_UPVOTE } from "@/lib/slack";
import { faunaDbClient, query } from "@/services/faunaDbClient";
import { slackClient } from "@/services/slackClient";
import { downvoteHeadline, setSelectedHeadline, upvoteHeadline } from "data/headlineData";
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
    case ACTION_SELECT:
      result = await setSelectedHeadline(id);
      break;
    default:
      throw new Error(`Unsupported action: ${action}`);
  }

  if (response_url) {
    // Do this, but async:
    setTimeout(async () => {
      try {
        await slackClient.post(response_url, { body: { test: "Thanks for voting!" } });
      } catch (e) {
        addLog({ where: "slackInteractionData/post response", message: e.message, response_url });
      }
    }, 500);
  }

  const logResult = faunaDbClient.query(
    query.Create(query.Collection("slack-interaction"), { data: { id, action, user: username, response_url } })
  );
  return { result, logResult };
};
