import { Request, Response } from "express";
import {
  HttpRequest,
  HttpResponse,
} from "../../domain/@shared/abstractions/http";

/**
 * Transforma Express.Request em HttpRequest
 */
export function adaptExpressRequest(req: Request): HttpRequest<any, any, any> {
  console.log(req.body);

  return {
    params: req.params,
    query: req.query,
    body: req.body,
    headers: req.headers as Record<string, string>, // simplificação
  };
}

/**
 * Transforma HttpResponse em Express.Response
 */
export function adaptExpressResponse<T>(
  res: Response,
  httpResponse: HttpResponse<T>
): void {
  if (httpResponse.headers) {
    for (const [key, value] of Object.entries(httpResponse.headers)) {
      res.setHeader(key, value);
    }
  }

  res.status(httpResponse.status);

  if (httpResponse.body) {
    res.json(httpResponse.body);
  } else {
    res.end();
  }
}
