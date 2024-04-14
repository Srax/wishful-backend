import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User.entity";
import { Encrypt } from "../helpers/encrypt";
import { UserDTO } from "../dto/user/user.dto";
import { UserController } from "./user.controller";
import { sanitizeUser } from "../utils/sanitizer";
import logger from "../utils/logger.utils";
import asyncHandler from "express-async-handler";

const NAMESPACE = "AUTH CONTROLLER";

// TODO: Make reusable
interface AuthRequest extends Request {
  currentUser?: UserDTO; // Define currentUser property
}

// TODO: Add better error handling to every controller
/**
 **asyncHandler : for handling exceptions that occur within async functions by passing them to our express error handlers.
 ** This will ensure that any errors that occur are properly handled and communicated to the client.
 */
export class AuthController {
  static login = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) {
    }
  });

  // static async loginold(req: Request, res: Response) {
  //   try {
  //     const { email, password } = req.body;

  //     if (!email || !password) {
  //       return res
  //         .status(500)
  //         .json({ message: "email and password are required!" });
  //     }

  //     const userRepo = AppDataSource.getRepository(User);
  //     let user = await userRepo.findOne({ where: { email } });

  //     if (!user) {
  //       return res.status(404).json({ message: "User not found!" });
  //     }
  //     const isPasswordValid = Encrypt.compare(user?.password, password);
  //     if (!isPasswordValid) {
  //       return res
  //         .status(500)
  //         .json({ message: "Email or password is incorrect!" });
  //     }

  //     const accessToken = Encrypt.generateJwtToken({ id: user.id });
  //     if (!accessToken) {
  //       return res
  //         .status(500)
  //         .json({ message: "Failed to create access token!" });
  //     }
  //     const refreshToken = Encrypt.generateRefreshToken({ id: user.id });
  //     if (!refreshToken) {
  //       return res
  //         .status(500)
  //         .json({ message: "Failed to create refresh token!" });
  //     }

  //     logger.info("It worked lol");

  //     return res.status(200).json({
  //       message: "Login successful!",
  //       user: sanitizeUser(user),
  //       tokens: {
  //         accessToken,
  //         refreshToken,
  //       },
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     return res.status(500).json({ message: "Internal server error" });
  //   }
  // }

  // static async refresh(req: Request, res: Response) {
  //   try {
  //     const { email, password } = req.body;

  //     if (!email || !password) {
  //       return res
  //         .status(500)
  //         .json({ message: "email and password are required!" });
  //     }

  //     const userRepo = AppDataSource.getRepository(User);
  //     let user = await userRepo.findOne({ where: { email } });

  //     if (!user) {
  //       return res.status(404).json({ message: "User not found!" });
  //     }
  //     const isPasswordValid = Encrypt.compare(user?.password, password);
  //     if (!isPasswordValid) {
  //       return res
  //         .status(500)
  //         .json({ message: "Email or password is incorrect!" });
  //     }

  //     const accessToken = Encrypt.generateJwtToken({ id: user.id });
  //     if (!accessToken) {
  //       return res
  //         .status(500)
  //         .json({ message: "Failed to create access token!" });
  //     }
  //     const refreshToken = Encrypt.generateRefreshToken({ id: user.id });
  //     if (!refreshToken) {
  //       return res
  //         .status(500)
  //         .json({ message: "Failed to create refresh token!" });
  //     }

  //     return res.status(200).json({
  //       message: "Login successful!",
  //       user: sanitizeUser(user),
  //       tokens: {
  //         accessToken,
  //         refreshToken,
  //       },
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     return res.status(500).json({ message: "Internal server error" });
  //   }
  // }

  // static async getProfile(req: AuthRequest, res: Response) {
  //   if (!req.currentUser) {
  //     return res.status(401).json({ message: "Unauthorized" });
  //   }
  //   const userRepo = AppDataSource.getRepository(User);
  //   const user = await userRepo.findOne({ where: { id: req.currentUser.id } });
  //   if (!user) {
  //     return res.status(404).json({ message: "User not found" });
  //   }
  //   res.status(200).json({ user: sanitizeUser(user) });
  // }
}
