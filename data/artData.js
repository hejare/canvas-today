import { getToday } from "@/lib/common";
import { faunaDbClient, query } from "@/services/faunaDbClient";

export const addArt = (data) => {
  return faunaDbClient.query(
    query.Create(query.Collection("art"), { data: { ...data } }),
  );
};

export const updateArt = (id, data) => {
  return faunaDbClient.query(
    query.Update(query.Ref(query.Collection("art"), id), { data: data }),
  );
};

export const getArt = async (id) => {
  const dbResponse = await faunaDbClient.query(
    query.Get(query.Ref(query.Collection("art"), id)),
  );
  return {
    ...dbResponse.data,
    ts: dbResponse.ts,
    id: dbResponse.ref.id,
  };
};

export const getArtsWithoutImageUrl = async () => {
  const dbResponse = await faunaDbClient.query(
    query.Map(
      query.Paginate(
        query.Match(query.Index("date-imageUrl-index"), getToday(), ""),
      ),
      query.Lambda((x) => query.Get(x)),
    ),
  );

  return dbResponse.data.map((d) => ({
    ...d.data,
    ts: d.ts,
    id: d.ref.id,
  }));
};

export const getArtsToday = async () => {
  const dbResponse = await faunaDbClient.query(
    query.Map(
      query.Paginate(query.Match(query.Index("art-date-index"), getToday())),
      query.Lambda((x) => query.Get(x)),
    ),
  );

  return dbResponse.data
    .filter((d) => d.data.imageUrl !== "")
    .map((d) => ({
      ...d.data,
      ts: d.ts,
      id: d.ref.id,
    }));
};

export const getSelectedArts = async () => {
  const dbResponse = await faunaDbClient.query(
    query.Map(
      query.Paginate(query.Match(query.Index("art-selected-index"), true)),
      query.Lambda((x) => query.Get(x)),
    ),
  );

  return dbResponse.data.map((d) => ({
    ...d.data,
    ts: d.ts,
    id: d.ref.id,
  }));
};

export const getAllArts = async () => {
  const dbResponse = await faunaDbClient.query(
    query.Map(
      query.Paginate(query.Documents(query.Collection("art"))),
      query.Lambda((x) => query.Get(x)),
    ),
  );
  return dbResponse.data.map((d) => ({
    ...d.data,
    ts: d.ts,
    id: d.ref.id,
  }));
};

export const upvoteArt = async (id) => {
  const art = await getArt(id);
  if (typeof art.votes !== "number") {
    art.votes = 1;
  } else {
    art.votes += 1;
  }
  return faunaDbClient.query(
    query.Update(query.Ref(query.Collection("art"), id), {
      data: art,
    }),
  );
};

export const downvoteArt = async (id) => {
  const art = await getArt(id);
  if (typeof art.votes !== "number") {
    art.votes = -1;
  } else {
    art.votes -= 1;
  }
  return faunaDbClient.query(
    query.Update(query.Ref(query.Collection("art"), id), {
      data: art,
    }),
  );
};

export const getSelectedArt = async () => {
  const dbResponse = await faunaDbClient.query(
    query.Map(
      query.Paginate(
        query.Match(query.Index("art-date-selected-index"), getToday(), true),
      ),
      query.Lambda((x) => query.Get(x)),
    ),
  );

  // THERE SHOULD ONLY BE ONE!!!
  if (dbResponse.data.length === 0) {
    return null;
  } else if (dbResponse.data.length > 1) {
    throw new Error(`We have too many selected art! ${dbResponse.length}`);
  }

  return {
    ...dbResponse.data[0].data,
    ts: dbResponse.data[0].ts,
    id: dbResponse.data[0].ref.id,
  };
};

export const setSelectedArt = async (id) => {
  const result = {};

  const currentSelectedArt = await getSelectedArt();
  if (currentSelectedArt) {
    currentSelectedArt.selected = false;
    faunaDbClient.query(
      query.Update(query.Ref(query.Collection("art"), currentSelectedArt.id), {
        data: currentSelectedArt,
      }),
    );
    result.previousSelectedSetToFalse = currentSelectedArt.id;
  }

  const art = await getArt(id);
  art.selected = true;

  result.dbResult = await faunaDbClient.query(
    query.Update(query.Ref(query.Collection("art"), id), {
      data: art,
    }),
  );
  return result;
};

export const unsetSelectedArt = async (id) => {
  const result = {};
  const art = await getArt(id);
  if (!art.selected) {
    return;
  }

  art.selected = false;

  result.dbResult = await faunaDbClient.query(
    query.Update(query.Ref(query.Collection("art"), id), {
      data: art,
    }),
  );
  return result;
};
