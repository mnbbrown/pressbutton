import { IncomingHttpHeaders } from "http";

export interface Request<RequestT> {
  body: RequestT;
  headers: IncomingHttpHeaders;
  path: string;
  method: string;
  params: { [key: string]: string };
  query: { [key: string]: string };
}

export interface Response {
  setHeader: (name: string, value: string[] | number | string) => void;
  send: (body: string | object, statusCode?: number) => void;
  adapted?: any;
  status?: number;
}

interface Event<ContextT = {}, RequestT = {}> {
  context: ContextT;
  req: Request<RequestT>;
  res: Response;
}

export interface Middleware<T> {
  (ctx: Event<T>, next: () => Promise<void>): Promise<void>;
}

export interface Route<ContextT> {
  name: string;
  path: string;
  method: string;
  handler: Middleware<ContextT>;
}
