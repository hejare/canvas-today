import { getToday } from "@/lib/common";
import { faunaDbClient, query } from "@/services/faunaDbClient";
import { headlineModel } from "./headlineModel";

export const getHeadlineStatus = async () => {
  const dbResponse = await faunaDbClient.query(
    query.Map(
      query.Paginate(query.Documents(query.Collection("headline-status"))),
      query.Lambda((x) => query.Get(x)),
    ),
  );
  return dbResponse.data.map((d) => {
    return {
      ...d.data,
      ref: d.ref.id,
    };
  });
};

export const setHeadlineStatus = (status) => {
  return faunaDbClient.query(
    query.Create(query.Collection("headline-status"), { status: status }),
  );
};

export const getAllHeadlines = async () => {
  const dbResponse = await faunaDbClient.query(
    query.Map(
      query.Paginate(query.Documents(query.Collection("headline"))),
      query.Lambda((x) => query.Get(x)),
    ),
  );
  return dbResponse.data.map((d) => ({
    ...d.data,
    id: d.ref.id,
  }));
};

export const getHeadlinesToday = async () => {
  const dbResponse = await faunaDbClient.query(
    query.Map(
      query.Paginate(query.Match(query.Index("date-index"), getToday())),
      query.Lambda((x) => query.Get(x)),
    ),
  );

  return dbResponse.data.map((d) => ({
    ...d.data,
    id: d.ref.id,
  }));
};

export const getHeadline = async (id) => {
  const dbResponse = await faunaDbClient.query(
    query.Get(query.Ref(query.Collection("headline"), id)),
  );
  return {
    ...dbResponse.data,
    id: dbResponse.ref.id,
  };
};

export const setHeadline = (id, data) => {
  return faunaDbClient.query(
    query.Update(query.Ref(query.Collection("headline"), id), { data: data }),
  );
};

export const addHeadline = (data) => {
  return faunaDbClient.query(
    query.Create(query.Collection("headline"), { data }),
  );
};

export const addHeadlines = (data) => {
  return faunaDbClient.query(
    query.Map(
      data,
      query.Lambda(
        "data",
        query.Create(query.Collection("headline"), { data: query.Var("data") }),
      ),
    ),
  );
};

export const deleteHeadline = (id) => {
  return faunaDbClient.query(
    query.Delete(query.Ref(query.Collection("headline"), id)),
  );
};

export const upvoteHeadline = async (id) => {
  const headline = await getHeadline(id);
  if (typeof headline.votes !== "number") {
    headline.votes = 1;
  } else {
    headline.votes += 1;
  }
  return faunaDbClient.query(
    query.Update(query.Ref(query.Collection("headline"), id), {
      data: headline,
    }),
  );
};

export const downvoteHeadline = async (id) => {
  const headline = await getHeadline(id);
  if (typeof headline.votes !== "number") {
    headline.votes = -1;
  } else {
    headline.votes -= 1;
  }
  return faunaDbClient.query(
    query.Update(query.Ref(query.Collection("headline"), id), {
      data: headline,
    }),
  );
};

export const appendHeadlines = async (rawHeadlines) => {
  const todaysHeadlines = await getHeadlinesToday();

  const storedHeadlines = todaysHeadlines.map(
    (todaysHeadline) => todaysHeadline.headline,
  );
  const headlinesToAdd = rawHeadlines.filter(
    (rawHeadline) => !storedHeadlines.includes(rawHeadline),
  );
  const newHeadlines = headlinesToAdd.map(headlineModel);

  return faunaDbClient.query(
    query.Map(
      newHeadlines,
      query.Lambda(
        "data",
        query.Create(query.Collection("headline"), { data: query.Var("data") }),
      ),
    ),
  );
};

export const getSelectedHeadline = async () => {
  const dbResponse = await faunaDbClient.query(
    query.Map(
      query.Paginate(
        query.Match(query.Index("date-selected-index"), getToday(), true),
      ),
      query.Lambda((x) => query.Get(x)),
    ),
  );

  // THERE SHOULD ONLY BE ONE!!!
  if (dbResponse.data.length === 0) {
    return null;
  } else if (dbResponse.data.length > 1) {
    throw new Error(
      `We have too many selected headliens! ${dbResponse.length}`,
    );
  }

  return {
    ...dbResponse.data[0].data,
    id: dbResponse.data[0].ref.id,
  };
};

export const setSelectedHeadline = async (id) => {
  const result = {};

  const currentSelectedHeadline = await getSelectedHeadline();
  if (currentSelectedHeadline) {
    currentSelectedHeadline.selected = false;
    faunaDbClient.query(
      query.Update(
        query.Ref(query.Collection("headline"), currentSelectedHeadline.id),
        { data: currentSelectedHeadline },
      ),
    );
    result.previousSelectedSetToFalse = currentSelectedHeadline.id;
  }

  const headline = await getHeadline(id);
  headline.selected = true;

  result.dbResult = await faunaDbClient.query(
    query.Update(query.Ref(query.Collection("headline"), id), {
      data: headline,
    }),
  );
  return result;
};
