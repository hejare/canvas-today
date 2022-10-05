import { newsClient } from "@/services/newsClient";
import { JSDOM } from "jsdom";
import { parseNames } from "people-names";

const NEWS_BASE_URL = process.env.NEWS_BASE_URL;

export const getNews = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const rawResponse = await newsClient.get(NEWS_BASE_URL);
      const DOM = new JSDOM(rawResponse);
      const elements = DOM.window.document.querySelectorAll("h3");
      const headlines = [];
      for (let i = 0; i < elements.length; i++) {
        headlines.push(elements[i].textContent.trim());
      }
      return resolve(headlines);
    } catch (e) {
      return reject(e);
    }
  });
};

export const headlineRegex = new RegExp(/[^a-zA-Z ´:"']/g); // What about: - . [0-9]
export const filterHeadlines = (headlines) => {
  return headlines.filter(headline => {
    const names = parseNames(headline);
    if (names.length > 0) {
      return false;
    }
    if (headline.match(headlineRegex)) {
      return false;
    }
    return true;
  });
};