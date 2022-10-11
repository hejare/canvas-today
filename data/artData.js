import { getToday } from "@/lib/common";
import { faunaDbClient, query } from "@/services/faunaDbClient";

export const addArt = (data) => {
  return faunaDbClient.query(
    query.Create(query.Collection("art"), { data: { ...data } })
  );
};

export const updateArt = (id, data) => {
  return faunaDbClient.query(
    query.Update(query.Ref(query.Collection("art"), id), { data: data })
  );
};

export const getArtsWithoutImageUrl = async () => {
  const dbResponse = await faunaDbClient.query(
    query.Map(
      query.Paginate(query.Match(query.Index("date-imageUrl-index"), getToday(), "")),
      query.Lambda(x => query.Get(x))
    )
  );

  return dbResponse.data.map(d => ({
    ...d.data,
    id: d.ref.id,
  }));
};

export const getArtsToday = async () => {
  const dbResponse = await faunaDbClient.query(
    query.Map(
      query.Paginate(query.Match(query.Index("art-date-index"), getToday())),
      query.Lambda(x => query.Get(x))
    )
  );

  return dbResponse.data.filter(d => d.data.imageUrl !== "").map(d => ({
    ...d.data,
    id: d.ref.id,
  }));
};
