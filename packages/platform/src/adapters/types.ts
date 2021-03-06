import { IncomingHttpHeaders } from "http";
import { Context } from "./context";

export interface NextFn {
  (): Promise<void> | void;
}

export interface HandlerFn<RequestT = any, ResponseT = any, ContextT = any> {
  (
    ctx: Context<ContextT>,
    req: Request<RequestT>,
    res: Response<ResponseT>,
    next: NextFn
  ): Promise<void> | void;
}

export interface Request<T = any> {
  body: T;
  headers: IncomingHttpHeaders;
  path: string;
  method: string;
  params: { [key: string]: string };
  query: { [key: string]: string };
}

export interface HttpResponse<T = undefined> {
  body: T;
  headers?: { [key: string]: string };
  statusCode?: number;
}

export interface Response<T = undefined> {
  send(response: HttpResponse<T>): void;
}
