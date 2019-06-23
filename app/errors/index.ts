export class ApiError extends Error {
  public status: number;

  public constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export class UnprocessableEntityError extends ApiError {
  public constructor(message: string = "Unprocessable Entity") {
    super(message, 422);
  }
}

export class NotFoundError extends ApiError {
  public constructor(message: string = "Not Found") {
    super(message, 404);
  }
}

export class ValidationError extends Error {}
