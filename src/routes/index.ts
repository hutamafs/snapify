import { Router } from "express";
import authRouter from "./auth.route.js";
import imageRouter from "./image.route.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/images", imageRouter);

export default router;
