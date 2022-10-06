import { newsClient } from "@/services/newsClient";
import { JSDOM } from "jsdom";
import { parseNames } from "people-names";

const NEWS_BASE_URL = process.env.NEWS_BASE_URL;

export const getNewsHeadlines = async () => {
  const rawResponse = await newsClient.get(NEWS_BASE_URL);
  const DOM = new JSDOM(rawResponse);
  const elements = DOM.window.document.querySelectorAll("h3");
  const headlines = [];
  for (let i = 0; i < elements.length; i++) {
    headlines.push(elements[i].textContent.trim());
  }
  return headlines;
};

export const headlineRegex = new RegExp(/[^a-zA-Z.\- ´:"']/g); // What about: - [0-9]
export const filterHeadlines = (headlines) => {
  return headlines.filter(headline => {
    let adjustedHeadline = headline.replace(/[']/g, " "); // names with apostroph (') is missed if not managed like this
    adjustedHeadline = adjustedHeadline.replace(/[^a-zA-Z ]/g, ""); // need to remove special characters
    adjustedHeadline = "IGNOREME " + adjustedHeadline + " IGNOREME"; // Prepend dumy string since method dont identify names if its the first word
    const names = parseNames(adjustedHeadline);

    if (names.length > 0) {
      return false;
    }
    if (headline.match(headlineRegex)) {
      return false;
    }
    return true;
  });
};