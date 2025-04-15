import { ZodError } from "zod";
import { Request, Response } from "express";
import { postImageSchema, postCommentSchema } from "../types";
import * as imageService from "../services/image.services";
import { handleZodError } from "../utils";

const getAllImages = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (user) {
      const images = await imageService.getAllImages(user.id);
      res
        .status(200)
        .json({ status: true, data: images, message: "successfull fetched all images" });
    }
  } catch (error) {
    res.status(400).json({ status: false, message: (error as Error).message });
  }
};

const getMyImages = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    if (user) {
      const { images, total } = await imageService.getMyImages(user.id, limit, offset);
      res.status(200).json({
        status: true,
        data: images,
        message: "successfull fetched my images",
        pagination: {
          page,
          limit,
        },
        total,
      });
    } else {
      throw new Error("no user found");
    }
  } catch (error) {
    res.status(400).json({ status: false, message: (error as Error).message });
  }
};

const postImage = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (user) {
      const validated = postImageSchema.parse(req.body);
      const image = await imageService.postImage(validated, user.id);
      res.status(201).json({ status: true, data: image, message: "successfully post image" });
    } else {
      throw new Error("no user found");
    }
  } catch (error) {
    if (error instanceof ZodError) {
      handleZodError(res, error);
    }
    res.status(400).json({ status: false, message: (error as Error).message });
  }
};

const likeImage = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const id = req.params.id;
    if (user && id) {
      const image = await imageService.likeImage(id, user.id);
      res.status(201).json({ status: true, data: image, message: "successfully like image" });
    } else {
      throw new Error("no user found or no image found");
    }
  } catch (error) {
    res.status(400).json({ status: false, message: (error as Error).message });
  }
};

const unlikeImage = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const id = req.params.id;
    if (user && id) {
      await imageService.unlikeImage(id, user.id);
      res.status(200).json({ status: true, message: "successfully unlike image" });
    } else {
      throw new Error("no user found or no image found");
    }
  } catch (error) {
    res.status(400).json({ status: false, message: (error as Error).message });
  }
};

const deleteImage = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const id = req.params.id;
    if (user && id) {
      await imageService.deleteImage(id, user.id);
      res.status(200).json({ status: true, message: "successfully delete image" });
    } else {
      throw new Error("no user found or no image found");
    }
  } catch (error) {
    res.status(400).json({ status: false, message: (error as Error).message });
  }
};

const getComments = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const id = req.params.id;
    if (user && id) {
      const comments = await imageService.getComments(id);
      res.status(200).json({
        status: true,
        data: comments,
        message: `successfully fetch comments for image ${id}`,
      });
    } else {
      throw new Error("no user found or no image found");
    }
  } catch (error) {
    res.status(400).json({ status: false, message: (error as Error).message });
  }
};

const postComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const id = req.params.id;
    if (user && id) {
      const validated = postCommentSchema.parse(req.body);
      const image = await imageService.postComment(validated, id, user.id);
      res.status(201).json({ status: true, data: image, message: "successfully post comment" });
    } else {
      throw new Error("no user found or no image found");
    }
  } catch (error) {
    res.status(400).json({ status: false, message: (error as Error).message });
  }
};

const deleteComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const imageId = req.params.id;
    const commentId = req.params.commentId;

    if (user && imageId && commentId) {
      await imageService.deleteComment(imageId, commentId, user.id);
      res.status(200).json({
        status: true,
        message: `successfully deleted comment for image ${imageId}`,
      });
    } else {
      throw new Error("no user found or no image found");
    }
  } catch (error) {
    res.status(400).json({ status: false, message: (error as Error).message });
  }
};

export {
  getAllImages,
  getMyImages,
  postImage,
  likeImage,
  unlikeImage,
  deleteComment,
  getComments,
  postComment,
  deleteImage,
};
