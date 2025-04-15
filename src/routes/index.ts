import { Router } from "express";
import authRouter from "./auth.route";
import imageRouter from "./image.route";

const router = Router();

router.use("/auth", authRouter);
router.use("/images", imageRouter);

export default router;
