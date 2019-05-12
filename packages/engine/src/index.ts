import { Route, Middleware } from "./types";
import { join } from "path";
import { compose } from "./compose";

interface RouteConfig<ContextT> {
  path: string;
  name: string;
  method: string;
  handler: Middleware<ContextT>;
}

const removeParams = (path: string) => {
  return path
    .split("/")
    .map(part => (part.startsWith(":") ? "{param}" : part))
    .join("/");
};

export class API<ContextT = {}> {
  public routes: Route<ContextT>[] = [];
  private paths: Set<string> = new Set();
  private middleware: Middleware<ContextT>[] = [];

  public mount(path: string, api: API<ContextT>) {
    api.routes.forEach(route => {
      const mountedPath = join(path, route.path);
      if (this.paths.has(removeParams(mountedPath))) {
        throw new Error(
          `path collision ${removeParams(mountedPath)} ` +
            Array.from(this.paths)
        );
      }
      this.use({
        ...route,
        path: join(path, route.path)
      });
    });
  }

  public use(config: RouteConfig<ContextT> | Middleware<ContextT>) {
    if (typeof config === "function") {
      this.middleware.push(config as Middleware<ContextT>);
      return;
    }
    const { path, name, method, handler } = config;
    if ((path || path === "") && name && method) {
      this.paths.add(removeParams(path));
      this.routes.push({
        path,
        name,
        method,
        handler: compose([...this.middleware, handler])
      });
    } else {
      throw new Error("Incorrect route config");
    }
  }
}
