import { faunaDbClient, query } from "@/services/faunaDbClient";

export const addNft = async (data) => {
  const dbResponse = await faunaDbClient.query(
    query.Create(query.Collection("nft"), { data: { ...data } }),
  );

  return {
    ...dbResponse.data,
    ts: dbResponse.ts,
    id: dbResponse.ref.id,
  };
};

export const updateNft = (id, data) => {
  return faunaDbClient.query(
    query.Update(query.Ref(query.Collection("nft"), id), { data: data }),
  );
};

export const getNft = async (id) => {
  const dbResponse = await faunaDbClient.query(
    query.Get(query.Ref(query.Collection("nft"), id)),
  );
  return {
    ...dbResponse.data,
    ts: dbResponse.ts,
    id: dbResponse.ref.id,
  };
};

export const getNftByArtId = async (artId) => {
  const dbResponse = await faunaDbClient.query(
    query.Map(
      query.Paginate(query.Match(query.Index("nft-artid-index"), artId)),
      query.Lambda((x) => query.Get(x)),
    ),
  );

  return dbResponse.data.map((d) => ({
    ...d.data,
    ts: d.ts,
    id: d.ref.id,
  }));
};

export const getNftsWithoutIpfsUrl = async () => {
  const dbResponse = await faunaDbClient.query(
    query.Map(
      query.Paginate(query.Match(query.Index("nft-ipfsUrl-index"), "")),
      query.Lambda((x) => query.Get(x)),
    ),
  );

  return dbResponse.data.map((d) => ({
    ...d.data,
    ts: d.ts,
    id: d.ref.id,
  }));
};

export const getAllNfts = async () => {
  const dbResponse = await faunaDbClient.query(
    query.Map(
      query.Paginate(query.Documents(query.Collection("nft"))),
      query.Lambda((x) => query.Get(x)),
    ),
  );
  return dbResponse.data.map((d) => ({
    ...d.data,
    ts: d.ts,
    id: d.ref.id,
  }));
};
