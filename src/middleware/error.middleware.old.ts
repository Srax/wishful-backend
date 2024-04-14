// server/src/middleware/errorMiddleware.ts

import { NextFunction, Request, Response } from "express"; // Import types for clarity

export const notFoundHandler: (
  req: Request,
  res: Response,
  next: NextFunction
) => void = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404).json({ message: error.message }); // Use JSON response for consistency
  next(error);
};

export const generalErrorHandler: (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => void = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });

  // Pass the error to Express.js for further handling (optional)
  next(err);
};
