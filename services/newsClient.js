import { uuid } from "@/lib/common";

const baseHeaders = { "Content-Type": "application/json" };
const baseOptions = { headers: {}, body: {}, params: {}, stringify: true };

const handleError = async ({ external, error }) => {
  if (external) {
    // console.error("Error in Slack: ", error);
    return Promise.reject({ location: "external (News site)", message: error });
  }

  // Message for developer when Client crashes.
  // console.error("Error in Client: ", error);

  // Message for user when Client crashes
  const reason = "Oops! Something went wrong.";
  return Promise.reject({ location: "internal (Serverside or Client)", message: error || reason });
};

const convertResult = async (result) => {
  const text = await result.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

const handleResult = async (result) => {
  try {
    const data = await convertResult(result);
    const reason = { external: true, error: data };
    return result.ok ? Promise.resolve(data) : Promise.reject(reason);
  } catch (error) {
    const reason = { external: false, error };
    return Promise.reject(reason);
  }
};

const additionalHeaders = () => {
  const xRequestId = uuid();

  return {
    "x-request-id": xRequestId,
  };
};

const fetcher = async (
  endpoint,
  { method, headers = {}, body, params = {} } = baseOptions
) => {
  const url = `${endpoint}?${new URLSearchParams({
    ...params,
  })}`;
  const options = {
    method,
    headers: { ...baseHeaders, ...additionalHeaders(), ...headers },
    body: ["GET", "DELETE"].includes(method) ? null : JSON.stringify(body),
  };
  // console.log("NEWS:", options, url)
  return fetch(url, options).then(handleResult).catch(handleError);
};

const post = (url, { headers, params, body } = baseOptions) =>
  fetcher(url, {
    method: "POST",
    headers,
    params,
    body,
  });

const generic =
  (method) =>
    (url, { headers, params } = baseOptions) =>
      fetcher(url, {
        method: method,
        headers,
        params,
      });

export const newsClient = {
  get: generic("GET"),
  post: post,
};
