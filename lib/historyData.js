import { faunaDbClient, query } from "@/services/faunaDbClient";

export const getHistory = async ({ ref }) => {
  const dbResponse = await faunaDbClient.query(
    query.Get(query.Ref(query.Collection("generated-images"), ref)),
  );
  return dbResponse.data;
};

export const getAllHistory = async () => {
  const dbResponse = await faunaDbClient.query(
    query.Map(
      query.Paginate(query.Documents(query.Collection("generated-images"))),
      query.Lambda((x) => query.Get(x)),
    ),
  );
  return dbResponse.data.map((d) => {
    const ref = JSON.stringify(d.ref);
    return {
      ...d.data,
      ref: JSON.parse(ref)["@ref"].id,
    };
  });
};

export const addHistory = (data) => {
  return faunaDbClient.query(
    query.Create(query.Collection("generated-images"), { data }),
  );
};
