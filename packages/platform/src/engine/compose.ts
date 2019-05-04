import { Middleware } from "./types";

export const compose = function<T>(
  middleware: Middleware<T> | Middleware<T>[]
): Middleware<T> {
  const handlers = Array.isArray(middleware) ? middleware : [middleware];
  const composed: Middleware<T> = async function(ctx, next) {
    const dispatch = async (i: number) => {
      const fn = i === handlers.length ? next : handlers[i];
      if (!fn) {
        return;
      }
      return await fn(ctx, dispatch.bind(null, i + 1));
    };
    return dispatch(0);
  };

  Object.defineProperty(composed, "name", {
    value: handlers.map(h => h.name).join("->"),
    configurable: true
  });
  return composed;
};
