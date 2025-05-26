import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { ApiHttpError, HttpError } from "../../domain/@shared/errors/http";

export const globalErrorMiddleware: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiHttpError) {
    const resp: HttpError = {
      code: err.code,
      message: err.message,
      errors: err.errors,
    };

    res.status(resp.code).json(resp);
    return;
  }

  console.error("Unhandled error:", err);

  const resp: HttpError = {
    code: 500,
    message: err.message,
  };

  res.status(500).json(resp);
};
