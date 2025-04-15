import { serialize } from "cookie";
import { ZodError } from "zod";
import type { Request, Response } from "express";
import { registerSchema, loginSchema } from "../types/auth.schema.js";
import * as authService from "../services/auth.services.js";
import { handleZodError } from "../utils/index.js";

const register = async (req: Request, res: Response) => {
  try {
    const validated = registerSchema.parse(req.body);
    const token = await authService.register(validated);
    res.status(201).json({ status: true, data: token, message: "successfully registered" });
  } catch (error) {
    if (error instanceof ZodError) {
      handleZodError(res, error);
    }
    res.status(400).json({ status: false, message: (error as Error).message });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const validated = loginSchema.parse(req.body);
    const token = await authService.login(validated);
    res.setHeader(
      "Set-Cookie",
      serialize("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      }),
    );
    res.status(200).json({ status: true, data: token, message: "successfully login" });
  } catch (error) {
    if (error instanceof ZodError) {
      handleZodError(res, error);
    }
    res.status(400).json({ status: false, message: (error as Error).message });
  }
};

const me = async (req: Request, res: Response) => {
  res.status(200).json({ message: "user found", status: true, user: req.user });
};

export { register, login, me };
