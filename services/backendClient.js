import { uuid } from "@/lib/common";
import { InstanceNotFoundError } from "@/lib/error";

const baseHeaders = { "Content-Type": "application/json" };
const baseOptions = { headers: {}, body: {}, params: {}, stringify: true };

const INSTANCE_NOT_FOUND = "instance not found";
const handleError = async ({ external, error }) => {
  if (external) {
    if (error.error === INSTANCE_NOT_FOUND) {
      throw new InstanceNotFoundError(error);
    }
    return Promise.reject({ location: "external (Backend)", message: error });
  }

  // Message for user when Client crashes
  const reason = "Oops! Something went wrong.";
  return Promise.reject({
    location: "internal (BackendClient related - Serverside or Client)",
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
  { method, headers = {}, body, params = {} } = baseOptions,
) => {
  const url = `/api/${endpoint}?${new URLSearchParams({
    ...params,
  })}`;
  const options = {
    method,
    headers: { ...baseHeaders, ...additionalHeaders(), ...headers },
    body: ["GET", "DELETE"].includes(method) ? null : JSON.stringify(body),
  };
  return fetch(url, options).then(handleResult).catch(handleError);
};

const generic = (method) => {
  return (url, { headers, params } = baseOptions) =>
    fetcher(url, {
      method: method,
      headers,
      params,
    });
};

const genericWithBody = (method) => {
  return (url, { headers, params, body } = baseOptions) =>
    fetcher(url, {
      method: method,
      headers,
      params,
      body,
    });
};

export const backendClient = {
  get: generic("GET"),
  post: genericWithBody("POST"),
  put: genericWithBody("PUT"),
  delete: generic("DELETE"),
};
