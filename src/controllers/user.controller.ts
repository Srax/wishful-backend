import { Request, Response } from "express";
import { User } from "../entities/User.entity";
import { AppDataSource } from "../data-source";
import { AuthHelper } from "../helpers/encrypt";
import { UserDTO } from "../dto/user/user.dto";
import * as cache from "memory-cache";

import { sanitizeUser as sanitize } from "../utils/sanitizer";
import { validate } from "class-validator";
import { Role } from "../entities/Role.entity";

interface SignUpRequestBody {
  email: string;
  password: string;
  firstName: string;
  lastName?: string; // Make lastName optional
}

export class UserController {
  static async create(req: Request, res: Response) {
    const { email, password, firstName, lastName } = req.body;

    // Data validation (optional, replace with your validation logic)
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const encryptedPassword = await AuthHelper.encrypt(password);
    let user = new User(email, encryptedPassword, firstName, lastName);
    // TODO: Fix validation so it actually works
    // const validationErrors = await validate(user);

    // if (validationErrors.length > 0) {
    //   return res.status(500).json({ errors: validationErrors });
    // }

    try {
      const userRepo = AppDataSource.getRepository(User);
      await userRepo.save(user);
      const accessToken = AuthHelper.generateAccessToken({ id: user.id });
      const refreshToken = AuthHelper.generateRefreshToken({ id: user.id });
      return res.status(201).json({
        message: "User created successfully",
        accessToken,
        refreshToken,
        user: sanitize(user),
      });
    } catch (error) {
      console.error(error);
    }
  }

  static async getAll(req: Request, res: Response) {
    const data = cache.get("data");
    if (data) {
      return res.status(200).json({ data });
    }

    const userRepo = AppDataSource.getRepository(User);
    const users = userRepo.find();

    cache.put("data", users, 60000);
    return res.status(200).json({ data: users });
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const { firstName, lastName, email } = req.body;
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { id: id } });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    await userRepo.save(user);
    return res
      .status(200)
      .send({ message: "User updated successfully", user: sanitize(user) });
  }
  static async delete(req: Request, res: Response) {
    const { id } = req.params;
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { id: id } });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    await userRepo.remove(user);
    return res.status(200).send({ message: "User deleted successfully" });
  }
}
