export interface HttpError {
  message: string;
  code: number;
}

export class BadRequestHttpError extends Error implements HttpError {
  code: number;

  constructor(message: string) {
    super(message);
    this.name = "BadRequestHttpError";
    this.code = 400;

    Object.setPrototypeOf(this, BadRequestHttpError.prototype);
  }
}

export class UnprocessableEntityHttpError extends Error implements HttpError {
  code: number;

  constructor(message: string = "Unprocessable Entity") {
    super(message);
    this.name = "UnprocessableEntityHttpError";
    this.code = 422;

    Object.setPrototypeOf(this, UnprocessableEntityHttpError.prototype);
  }
}

export class NotFoundHttpError extends Error implements HttpError {
  code: number;

  constructor(message: string = "Resource not found") {
    super(message);
    this.name = "NotFoundHttpError";
    this.code = 404;

    Object.setPrototypeOf(this, NotFoundHttpError.prototype);
  }
}

export class ConflictHttpError extends Error implements HttpError {
  code: number;

  constructor(message: string = "Conflict") {
    super(message);
    this.name = "ConflictHttpError";
    this.code = 409;

    Object.setPrototypeOf(this, ConflictHttpError.prototype);
  }
}
