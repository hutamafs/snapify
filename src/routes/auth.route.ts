import { Router } from "express";
import * as authController from "../controller/auth.controller.js";
import { middleware } from "../middleware/auth.middleware.js";

const authRouter = Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.get("/me", middleware, authController.me);

export default authRouter;
