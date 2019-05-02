import { Middleware } from "middy";

export const response: Middleware<{}> = () => ({
  after: (handler, next) => {
    console.log(handler.response);
    next();
  }
});
