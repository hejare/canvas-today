const faunadb = require("faunadb");
export const query = faunadb.query;

const apiKey = process.env.FAUNADB_API_KEY;
const apiBaseUrl = process.env.FAUNADB_API_BASE_URL;

let mg, domain, port, scheme;
if ((mg = apiBaseUrl.match(/^(https?):\/\/([^:]+)(:(\d+))?/))) {
  scheme = mg[1] || "https";
  domain = mg[2] || "db.fauna.com";
  port = mg[4] || 443;
}
export const faunaDbClient = new faunadb.Client({
  secret: apiKey,
  domain: domain,
  port: port,
  scheme: scheme,
});
