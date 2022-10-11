import { getToday } from "@/lib/common";

const initialHeadlineModel = {
  headline: "", // indexed
  votes: 0,
  selected: false,
  source: "reuters", // TODO: make dynamic for multiple sources
  date: "to-be-overridden",
};

export const headlineModel = (headline) => {
  return {
    ...initialHeadlineModel,
    headline,
    date: getToday(),
  };
};
