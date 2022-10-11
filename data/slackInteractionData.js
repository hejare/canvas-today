import { faunaDbClient, query } from "@/services/faunaDbClient";
// import { downvoteHeadline, upvoteHeadline } from "data/headlineData";

export const addInteraction = async (data) => {
  // const id = ""; //data....
  // const action = ""; //data....

  // let result;
  // switch (action) {
  //   case "upvote":
  //     result = await upvoteHeadline(id);
  //     break;
  //   case "downvote":
  //     result = await downvoteHeadline(id);
  //     break;
  //   default:
  //     throw new Error(`Unsupported action: ${action}`);
  // }
  // JSON.stringify(data)
  const logResult = faunaDbClient.query(
    query.Create(query.Collection("slack-interaction"), { data: { body: JSON.stringify(data) } })
  );
  return logResult;
  // return { result, logResult };
};
