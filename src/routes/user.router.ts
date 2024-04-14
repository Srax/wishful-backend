import { NextFunction, Request, Response, Router } from "express";
import asyncHandler from "express-async-handler";
import { checkJwt } from "../middleware/auth.middleware.old";
import { UserController } from "../controllers/user.controller";
import { authentication, authorization } from "../middleware/auth.middleware";
import { UserRole } from "../types/roles.type";
import { AuthController } from "../controllers/auth.controller";

const router = Router();

router.get(
  "/",
  authentication,
  authorization([UserRole.ADMIN, UserRole.MODERATOR]),
  UserController.getAll
);

// router.get(
//   "/profile",
//   authentication,
//   authorization([UserRole.ADMIN, UserRole.MODERATOR, UserRole.USER]),
//   AuthController.getProfile
// );

router.post("/signup", UserController.create);
router.post("/login", AuthController.login);
router.post("/refresh", AuthController.login);

router.put(
  "/update/:id",
  authentication,
  authorization([UserRole.ADMIN, UserRole.MODERATOR, UserRole.USER]),
  UserController.update
);

router.delete(
  "/delete/:id",
  authentication,
  authorization([UserRole.ADMIN]),
  UserController.delete
);

export { router as userRouter };
