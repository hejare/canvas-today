import { faunaDbClient, query } from "@/services/faunaDbClient";

export const addLog = (data) => {
  return faunaDbClient.query(
    query.Create(query.Collection("log"), { data: { ...data } })
  );
};
