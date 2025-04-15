import { Router } from "express";
import * as imageController from "../controller/image.controller.js";
import { middleware } from "../middleware/auth.middleware.js";

const imageRouter = Router();

imageRouter.get("/me", middleware, imageController.getMyImages);
imageRouter.post("/:id/like", middleware, imageController.likeImage);
imageRouter.delete("/:id/like", middleware, imageController.unlikeImage);

imageRouter.get("/:id/comments", middleware, imageController.getComments);
imageRouter.post("/:id/comments", middleware, imageController.postComment);
imageRouter.delete("/:id/comments/:commentId", middleware, imageController.deleteComment);

imageRouter.post("/upload", middleware, imageController.postImage);
imageRouter.delete("/:id", middleware, imageController.deleteImage);
imageRouter.get("/", middleware, imageController.getAllImages);

export default imageRouter;
