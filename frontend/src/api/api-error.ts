import { ErrorMessages } from "../constants/Errors";

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/**This is official way to type custom errors for react-query */
declare module "@tanstack/react-query" {
  interface Register {
    defaultError: ApiError;
  }
}

/**Ignores deterministic failures of 4xx */
export const retryApiError = (failureCount: number, error: ApiError) =>
  failureCount < 3 && (error.status === 0 || error.status >= 500);

export const getServerError = (status: number, body: unknown) => {
  if (typeof body === "object" && body !== null && "message" in body) {
    const { message } = body;
    if (typeof message === "string") return new ApiError(message, status);
  }
  return new ApiError(ErrorMessages.FAILED_REQUEST, status);
};
