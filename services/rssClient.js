let Parser = require("rss-parser");
let parser = new Parser();

const rssClient = async (rssUrl) => {
  return await parser.parseURL(rssUrl);
};

export default rssClient;
