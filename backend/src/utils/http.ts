export const respond = (body?: object, statusCode?: number) => {
  if (!body) {
    return {
      statusCode: statusCode || 204
    };
  }
  return {
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json"
    },
    statusCode
  };
};

export class HttpError extends Error {
  public constructor(
    public statusCode: number,
    public message: string,
    public context?: object
  ) {
    super(message);
    Object.setPrototypeOf(this, HttpError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
