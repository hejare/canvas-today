import { uuid } from "@/lib/common";

const baseHeaders = { "Content-Type": "application/json" };
const baseOptions = { headers: {}, body: {}, params: {}, stringify: true };

const handleError = async ({ external, error }) => {
  if (external) {
    // console.error("Error in Slack: ", error);
    return Promise.reject({
      location: "external (ipfsProxy site)",
      message: error,
    });
  }

  // Message for developer when Client crashes.
  // console.error("Error in Client: ", error);

  // Message for user when Client crashes
  const reason = "Oops! Something went wrong.";
  return Promise.reject({
    location: "internal (ipfsProxyClient related - Serverside or Client)",
    message: error || reason,
  });
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
  { method, headers = {}, params = {} } = baseOptions,
  returnRaw = false,
) => {
  // Pass the ipfs address through a ipfs to https proxy:
  // List of proxies can be found here: https://ipfs.github.io/public-gateway-checker/
  const url = `${endpoint.replace(
    "ipfs://",
    "https://w3s.link/ipfs/",
  )}#x-ipfs-companion-no-redirect?${new URLSearchParams({
    ...params,
  })}`;

  const options = {
    method,
    headers: { ...baseHeaders, ...additionalHeaders(), ...headers },
  };
  // console.log("NEWS:", options, url)
  return fetch(url, options)
    .then((result) => {
      if (returnRaw) {
        return result;
      }
      return handleResult(result);
    })
    .catch(handleError);
};

const generic = (method, returnRaw) => {
  return (ipfsUrl, { headers, params } = baseOptions) =>
    fetcher(
      ipfsUrl,
      {
        method: method,
        headers,
        params,
      },
      returnRaw,
    );
};

export const ipfsProxyClient = {
  get: generic("GET"),
  getRaw: generic("GET", true),
};
