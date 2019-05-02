import { HandlerFn } from "./types";

export type Method = "GET" | "POST" | "PUT" | "DELETE" | "ANY";

export interface Route<ConfigT = {}, RequestT = {}, ResponseT = {}> {
  name: string;
  path: string;
  method: Method;
  handler: (config: ConfigT) => HandlerFn<RequestT, ResponseT>[];
  isPublic?: boolean;
}

export class API<ConfigT> {
  public routes: Route<ConfigT>[] = [];
}
