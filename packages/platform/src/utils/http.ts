export const respond = <T = any>(body?: T, statusCode?: number) => {
  if (!body) {
    return {
      statusCode: statusCode || 204
    };
  }
  return {
    body,
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
