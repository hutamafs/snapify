import { z } from "zod";

export const postImageSchema = z.object({
  s3Key: z.string(),
  url: z.string().url(),
  metadata: z.array(z.string()).optional(),
});

export const postCommentSchema = z.object({
  content: z.string(),
});

export type PostImageInput = z.infer<typeof postImageSchema>;
export type PostcommentInput = z.infer<typeof postCommentSchema>;
