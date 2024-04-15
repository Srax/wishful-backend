import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import config from "../config/config";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User.entity";
import { UserDTO } from "../dto/user/user.dto";
import { UserRole } from "../types/roles.type";
import { ApplicationError } from "../shared/errors/application.error";
import { AuthError } from "../shared/errors/types/auth.error.type";

// TODO: Make reusable
interface AuthRequest extends Request {
  currentUser?: UserDTO; // Define currentUser property
}

export const authentication = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.send(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const decode = jwt.verify(token, config.JWT.SECRET.KEY as string);
  if (!decode) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  req.currentUser = decode as UserDTO;
  next();
};

export const authorization = (roles: UserRole[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    const currentUser = req.currentUser; // Access currentUser directly from req object
    if (!currentUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { id: currentUser.id } });
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!roles.includes(user.role.name as UserRole)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};

export const authenticationNew = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new ApplicationError(AuthError.FAILED_AUTHENTICATION);
    // return res.send(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    throw new ApplicationError(AuthError.FAILED_AUTHENTICATION);
    // return res.status(401).json({ message: "Unauthorized" });
  }
  const decode = jwt.verify(token, config.JWT.SECRET.KEY as string);
  if (!decode) {
    throw new ApplicationError(AuthError.FAILED_AUTHENTICATION);
    // return res.status(401).json({ message: "Unauthorized" });
  }
  req.user = decode as UserDTO;
  console.log(req);
  next();
};
