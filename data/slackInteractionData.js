import { faunaDbClient, query } from "@/services/faunaDbClient";

export const addInteraction = (data) => {
  return faunaDbClient.query(
    query.Create(query.Collection("slack-interaction"), { data })
  );
};
