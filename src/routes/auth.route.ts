import { Router } from "express";
import * as authController from "../controller/auth.controller";
import { middleware } from "../middleware/auth.middleware";

export const authRouter = Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.get("/me", middleware, authController.me);
