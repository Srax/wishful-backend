import { NextFunction, Request, Response } from "express";
import { UserDTO } from "../dto/user/user.dto";

declare global {
  namespace Express {
    interface Request {
      user?: UserDTO; // Optional user property
    }
  }
}
