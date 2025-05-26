export interface HttpRequest<Params = {}, Query = {}, Body = {}> {
  params?: Partial<Params>;
  query?: Partial<Query>;
  body?: Body;
  headers?: Partial<Record<string, string>>;
}

export interface HttpResponse<T = any> {
  headers?: Record<string, string>;
  status: number;
  body?: T;
}
