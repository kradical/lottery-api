import { NextFunction, Request, Response } from "express";

import { ApiError } from "../errors";

const shouldLog = process.env.NODE_ENV !== "test";

const error = (
  error: ApiError,
  request: Request,
  res: Response,
  _: NextFunction
): void => {
  const status = error.status;
  const message = error.message;

  if (shouldLog) {
    console.error(error);
    console.error(error.status, error.message);
  }

  res.status(status).send({
    status,
    message
  });
};

export default error;
