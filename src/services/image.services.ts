import { eq, desc, count, and, sql, or } from "drizzle-orm";
import { commentsTable, imagesTable, likesTable } from "../db/schema.js";
import db from "../db/index.js";

const getAllImages = async (userId: number) => {
  const images = await db
    .select({
      id: imagesTable.id,
      s3Key: imagesTable.s3Key,
      url: imagesTable.url,
      userId: imagesTable.userId,
      metadata: imagesTable.metadata,
      likesCount: imagesTable.likesCount,
      createdAt: imagesTable.createdAt,
      liked: sql<boolean>`CASE WHEN ${likesTable.userId} IS NOT NULL THEN true ELSE false END`,
    })
    .from(imagesTable)
    .leftJoin(
      likesTable,
      and(eq(likesTable.userId, userId), eq(likesTable.imageId, imagesTable.id)),
    );
  return images;
};

const getMyImages = async (userId: number, limit: number, offset: number) => {
  const images = await db
    .select()
    .from(imagesTable)
    .where(eq(imagesTable.userId, userId))
    .orderBy(desc(imagesTable.createdAt))
    .limit(limit)
    .offset(offset);

  const [total] = await db
    .select({ count: count() })
    .from(imagesTable)
    .where(eq(imagesTable.userId, userId));
  return { images, total: total.count };
};

const postImage = async (
  {
    s3Key,
    url,
    metadata,
  }: {
    s3Key: string;
    url: string;
    metadata?: string[];
  },
  userId: number,
) => {
  const [image] = await db.insert(imagesTable).values({ s3Key, url, userId, metadata }).returning();
  return image;
};

const likeImage = async (imageId: string, userId: number) => {
  const [image] = await db.select().from(imagesTable).where(eq(imagesTable.id, +imageId));
  if (!image) throw new Error("image does not exist");
  const like = await db.insert(likesTable).values({ imageId: +imageId, userId });
  await db
    .update(imagesTable)
    .set({
      likesCount: sql`${imagesTable.likesCount} + 1`,
    })
    .where(eq(imagesTable.id, +imageId));
  return like;
};

const unlikeImage = async (imageId: string, userId: number) => {
  const [like] = await db
    .select()
    .from(likesTable)
    .where(and(eq(likesTable.imageId, +imageId), eq(likesTable.userId, userId)));
  if (!like) throw new Error("like does not exist");
  await db
    .update(imagesTable)
    .set({
      likesCount: sql`${imagesTable.likesCount} -1`,
    })
    .where(eq(imagesTable.id, +imageId));
  await db
    .delete(likesTable)
    .where(and(eq(likesTable.imageId, +imageId), eq(likesTable.userId, userId)));
};

const deleteImage = async (imageId: string, userId: number) => {
  const [image] = await db.select().from(imagesTable).where(eq(imagesTable.id, +imageId));
  if (!image) throw new Error("image does not exist");
  if (image.userId !== +userId) {
    throw new Error("unauthorized to delete the image");
  }
  await db.delete(imagesTable).where(eq(imagesTable.id, +imageId));
};

const getComments = async (imageId: string) => {
  const comments = await db.select().from(commentsTable).where(eq(commentsTable.imageId, +imageId));
  return comments;
};

const postComment = async ({ content }: { content: string }, imageId: string, userId: number) => {
  const [image] = await db.select().from(imagesTable).where(eq(imagesTable.id, +imageId));
  if (!image) throw new Error("image does not exist");
  const comment = await db.insert(commentsTable).values({ imageId: +imageId, userId, content });
  return comment;
};

const deleteComment = async (imageId: string, commentId: string, userId: number) => {
  const [comment] = await db
    .select({
      commentId: commentsTable.id,
      imageId: commentsTable.imageId,
      commentUserId: commentsTable.userId,
      imageOwnerId: imagesTable.userId,
    })
    .from(commentsTable)
    .leftJoin(imagesTable, eq(commentsTable.imageId, imagesTable.id))
    .where(eq(commentsTable.id, +commentId));

  if (!comment) throw new Error("comment does not exist");
  if (comment.imageId !== +imageId) {
    throw new Error("comment does not belong to this image");
  }
  if (comment.commentUserId !== userId && comment.imageOwnerId !== userId) {
    throw new Error("you are not authorized to delete this comment");
  }

  if (comment) {
    await db.delete(commentsTable).where(eq(commentsTable.id, +commentId));
  }
};

export {
  getAllImages,
  getMyImages,
  postImage,
  likeImage,
  unlikeImage,
  getComments,
  deleteComment,
  postComment,
  deleteImage,
};
