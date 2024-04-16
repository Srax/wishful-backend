import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User.entity";
import { AuthHelper } from "../helpers/encrypt";
import { UserDTO } from "../dto/user/user.dto";
import { UserController } from "./user.controller";
import { sanitizeUser } from "../utils/sanitizer";
import logger from "../utils/logger.utils";
import asyncHandler from "express-async-handler";
import { ApplicationError } from "../shared/errors/application.error";
import { AuthError } from "../shared/errors/types/auth.error.type";
import { CommonError } from "../shared/errors/types/common.error.type";
import { RefreshToken } from "../entities/refreshToken.entity";
import config from "../config/config";
import JWT from "jsonwebtoken";

const NAMESPACE = "AUTH CONTROLLER";
const userRepo = AppDataSource.getRepository(User);
const refreshTokenRepo = AppDataSource.getRepository(RefreshToken);

const EXPIRE_TIME = 60 * 1000; // 20 sec

const generateAccessAndRefreshTokens = async (userId: string) => {
  const user = await userRepo.findOne({ where: { id: userId } });
  if (!user) {
    throw new ApplicationError(AuthError.NOT_FOUND);
  }
  const accessToken = AuthHelper.generateAccessToken({ id: user.id });
  const refreshToken = AuthHelper.generateRefreshToken({ id: user.id });
  return { accessToken, refreshToken };
};

// TODO: Add better error handling to every controller
/**
 **asyncHandler : for handling exceptions that occur within async functions by passing them to our express error handlers.
 ** This will ensure that any errors that occur are properly handled and communicated to the client.
 */
export class AuthController {
  public static readonly login = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { email, password } = req.body;
      if (!email) {
        throw new ApplicationError(AuthError.BAD_REQUEST);
      }
      const user = await userRepo.findOne({ where: { email } });
      if (!user) {
        throw new ApplicationError(AuthError.NOT_FOUND);
      }
      const isMatch = AuthHelper.compare(user.password, password);
      if (!isMatch) {
        throw new ApplicationError(AuthError.CREDENTIALS_ERROR);
      }

      // // TODO : Redo this so tokens are stored in database
      // /** Generate refresh and access token for user */

      // const accessToken = AuthHelper.generateAccessToken({ id: user.id });
      // if (!accessToken) {
      //   throw new ApplicationError(CommonError.INTERNAL_SERVER_ERROR);
      // }

      // // TODO: THE EXPIRY DATE SHOULD NOT BE HARD CODED!!!
      // const rfshTkn = AuthHelper.generateRefreshToken({ id: user.id });
      // const refreshToken = await refreshTokenRepo.save(
      //   new RefreshToken(
      //     rfshTkn,
      //     user.id,
      //     new Date(new Date(new Date().getTime() + 60 * 60 * 24 * 1000))
      //   )
      // );

      // if (!rfshTkn || !refreshToken) {
      //   throw new ApplicationError(CommonError.INTERNAL_SERVER_ERROR);
      // }

      const { refreshToken, accessToken } =
        await generateAccessAndRefreshTokens(user.id);

      res
        .cookie("refreshToken", refreshToken, {
          expires: new Date(
            new Date(new Date().getTime() + 60 * 60 * 24 * 1000)
          ),
        })
        .header("Authorization", accessToken)
        .status(200)
        .json({
          message: "Authentication successful",
          user: sanitizeUser(user),
          success: true,
          backendTokens: {
            accessToken,
            refreshToken,
            expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
          },
        });
    }
  );

  public static readonly logout = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
        throw new ApplicationError(AuthError.FAILED_AUTHENTICATION);
      }
    }
  );

  // TODO : Fix access and refresh token for this register route

  public static readonly register = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { email, firstName, lastName, password } = req.body;

      // TODO: Update to include firstname and lastname too
      if (!email || !password) {
        throw new ApplicationError(AuthError.BAD_REQUEST);
      }

      const user = await userRepo.findOne({ where: { email: email } });
      if (user) {
        throw new ApplicationError(AuthError.EMAIL_ALREADY_EXIST);
      }

      const encryptedPassword = await AuthHelper.encrypt(password);
      let tmp = new User(email, encryptedPassword, firstName, lastName);
      const _user = await userRepo.save(tmp);

      // Generate token
      const accessToken = AuthHelper.generateAccessToken({ id: _user.id });
      res.status(200).json({
        message: "Registered successfully",
        user: _user,
        backendTokens: {
          accessToken,
        },
      });
    }
  );

  // // TODO: Think of a better way to do the refresh token... i dont think this is the way to go
  // public static readonly refreshToken = asyncHandler(
  //   async (req: Request, res: Response, next: NextFunction) => {
  //     const { refreshToken } = req.cookies.refreshToken;
  //     if (!refreshToken) {
  //       throw new ApplicationError(AuthError.REQUIRED_REFRESH_TOKEN);
  //     }

  //     // Check if refresh token exists
  //     const checkToken = await refreshTokenRepo.findOne({
  //       where: { token: refreshToken },
  //     });
  //     if (!checkToken) {
  //       throw new ApplicationError(AuthError.REQUIRED_REFRESH_TOKEN);
  //     }
  //     // TODO: This is really bad, it should be fixed
  //     if (AuthHelper.verifyExpiration(checkToken)) {
  //       await refreshTokenRepo.remove(checkToken);
  //       throw new ApplicationError(AuthError.EXPIRED_TOKEN);
  //     }

  //     // If the refresh token exists and has been verified, generate a new access token
  //     let newAccessToken = AuthHelper.generateAccessToken({
  //       id: refreshToken.userId,
  //     });
  //     res.status(200).json({
  //       accessToken: newAccessToken,
  //       refreshToken: refreshToken.token,
  //       expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
  //     });
  //   }
  // );
  public static readonly refreshToken = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const incomingRefreshToken = req.headers.authorization;
      console.log(incomingRefreshToken);
      if (!incomingRefreshToken) {
        throw new ApplicationError(AuthError.REQUIRED_REFRESH_TOKEN);
      }

      const user = req.user;
      if (!user) {
        throw new ApplicationError(AuthError.FAILED_AUTHENTICATION);
      }

      const { refreshToken, accessToken } =
        await generateAccessAndRefreshTokens(user.id);

      res.status(200).json({
        accessToken,
        refreshToken,
        expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
      });
    }
  );

  public static readonly getProfile = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
        throw new ApplicationError(AuthError.FAILED_AUTHENTICATION);
      }
      const userRepo = AppDataSource.getRepository(User);
      const user = await userRepo.findOne({
        where: { id: req.user.id },
      });
      if (!user) {
        throw new ApplicationError(AuthError.NOT_FOUND);
      }
      res.status(200).json(sanitizeUser(user));
    }
  );

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
