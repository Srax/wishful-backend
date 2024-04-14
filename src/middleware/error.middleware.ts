import { NextFunction, Request, Response } from "express";
import { ApplicationError } from "../shared/errors/application.error";
import { formatError } from "../shared/formatError";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof ApplicationError) {
    const code: any = error.statusCode || 500;
    return res.status(code).json(formatError(error));
  }

  return res.status(res.statusCode || 500).send({
    name: error.name,
    message: error.message,
    statusCode: res.statusCode || 500,
    code: error.stack,
  });
};
