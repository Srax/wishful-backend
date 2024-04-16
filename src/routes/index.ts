// server/src/routes/index.ts

import { Router } from "express";
import asyncHandler from "express-async-handler";
import { checkJwt } from "../middleware/auth.middleware.old";
import { userRouter } from "./user.router";
import { authRouter } from "./auth.routes";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req, res, next) => {
    res.status(200).send("Server Running...");
  })
);

router.use("/user", userRouter);
router.use("/auth", authRouter);

export default router;
