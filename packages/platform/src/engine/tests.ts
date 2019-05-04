import { Middleware } from "./types";
import { compose } from "./compose";

type Context = string[];

const resolve: Middleware<Context> = async (ctx, next) => {
  await next(ctx);
};

const middleware = (id: string): Middleware<Context> => async (ctx, next) => {
  ctx.locals.push(`before ${id}`);
  await next(ctx);
  ctx.locals.push(`after ${id}`);
};

const result = compose<Context>([middleware("a"), middleware("b"), resolve]);

(async () => {
  const context = { locals: ["exists"] };
  await result(context, () => Promise.resolve());
  console.log(context);
})();
