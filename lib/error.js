// eslint-disable-next-line prettier/prettier
export const IgnoreException = (e) => { };

function asErrorResponse(response) {
  return {
    reason: typeof response.reason === "string" ? response.reason : undefined,
    message:
      typeof response.message === "string" ? response.message : undefined,
  };
}

export class InstanceNotFoundError extends Error {
  constructor(rawResponse) {
    const response = asErrorResponse(rawResponse);

    // Set the message to the reason field, this is the only field that is available
    // when the backend is running in production mode.
    super(response.reason);

    this.name = "InstanceNotFoundError";
    this.response = response;
  }
}
