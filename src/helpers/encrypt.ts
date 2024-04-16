import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import config from "../config/config";
import { payload } from "../dto/user/user.create.dto";
import { Response } from "express";
import { RefreshToken } from "../entities/refreshToken.entity";

/**
 * Utility class for encryption-related operations such as hashing passwords and generating JWT tokens.
 */
export class AuthHelper {
  /**
   * Hashes the provided password using bcrypt.
   * @param password The password to hash.
   * @returns A promise that resolves to the hashed password.
   */
  static async encrypt(password: string) {
    return bcrypt.hashSync(password, 12);
  }

  /**
   * Compares a plain text password with a hashed password using bcrypt.
   * @param hash The hashed password.
   * @param plain The plain text password to compare.
   * @returns A promise that resolves to true if the passwords match, otherwise false.
   */
  static compare(hash: string, plain: string) {
    return bcrypt.compareSync(plain, hash);
  }

  /**
   * Generates a JWT token using the provided payload.
   * @param payload The payload to include in the JWT token.
   * @returns A promise that resolves to the generated JWT token.
   * @throws Error if JWT secret is not configured.
   */
  static generateAccessToken(payload: payload) {
    const secret = config.JWT.SECRET.KEY; // Get JWT secret from config
    console.log("Secret: " + secret);
    if (!secret || secret.length == 0) {
      throw new Error("JWT secret is not configured.");
    }
    return jwt.sign(payload, secret, {
      expiresIn: config.JWT.SECRET.EXPIRY,
    });
  }
  static generateRefreshToken(payload: payload) {
    const secret = config.JWT.REFRESH.KEY; // Get JWT secret from config
    if (!secret || secret.length == 0) {
      throw new Error("JWT secret is not configured.");
    }
    return jwt.sign(payload, secret, {
      expiresIn: config.JWT.REFRESH.EXPIRY,
    });
  }

  static verifyExpiration(refreshToken: RefreshToken) {
    return refreshToken.expiryDate.getTime() < new Date().getTime();
  }

  static clearToken(res: Response) {
    res.cookie("accessToken", "", {
      expires: new Date(0),
    });
    res.cookie("refreshToken", "", {
      expires: new Date(0),
    });
  }
}
