export interface HttpRequest<Params = {}, Query = {}, Body = {}> {
  params: Params;
  query: Query;
  body: Body;
  headers: Record<string, string>;
}

export interface HttpResponse<T = any> {
  headers?: Record<string, string>;
  status: number;
  body?: T;
}
