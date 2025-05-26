export interface HttpError {
  message: string;
  code: number;
  errors?: Record<string, string>;
}

export abstract class ApiHttpError extends Error implements HttpError {
  code: number;
  errors: Record<string, string> | undefined;

  protected constructor(message: string, code: number, name: string) {
    super(message);
    this.name = name;
    this.code = code;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class BadRequestHttpError extends ApiHttpError {
  constructor(message: string = "Bad Request") {
    super(message, 400, "BadRequestHttpError");
  }
}

export class UnprocessableEntityHttpError extends ApiHttpError {
  constructor(message: string = "Unprocessable Entity") {
    super(message, 422, "UnprocessableEntityHttpError");
  }
}

export class NotFoundHttpError extends ApiHttpError {
  constructor(message: string = "Resource not found") {
    super(message, 404, "NotFoundHttpError");
  }
}

export class ConflictHttpError extends ApiHttpError {
  constructor(message: string = "Conflict") {
    super(message, 409, "ConflictHttpError");
  }
}

export class ValidationError extends ApiHttpError {
  constructor(
    message: string = "Validate Error",
    errors?: Record<string, string>
  ) {
    super(message, 422, "UnprocessableEntityHttpError");
    this.errors = errors;
  }
}
