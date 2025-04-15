import { ZodError } from "zod";
import type { Response } from "express";

const handleZodError = (res: Response, error: ZodError) => {
  const messages = error.errors.map((e) => `${e.path[0]}: ${e.message}`);
  return res.status(400).json({ status: false, message: messages });
};

export default handleZodError;
