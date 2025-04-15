import { relations } from "drizzle-orm";
import { integer, pgTable, varchar, timestamp, json, index, unique } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  role: varchar().notNull().default("user"),
  password: varchar().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  bannedAt: timestamp(),
  createdAt: timestamp().defaultNow(),
});

export const commentsTable = pgTable(
  "comments",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    content: varchar({ length: 255 }).notNull(),
    userId: integer().references(() => usersTable.id, { onDelete: "cascade" }),
    imageId: integer(),
    createdAt: timestamp().defaultNow(),
  },
  (table) => ({
    createdAtIndex: index("comments_createdAt_index").on(table.createdAt),
  }),
);

// Define relations
export const commentsRelations = relations(commentsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [commentsTable.userId],
    references: [usersTable.id],
  }),
}));

export const refreshTokensTable = pgTable("refresh_tokens", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  token: varchar().notNull(),
  createdAt: timestamp().defaultNow(),
  expiredAt: timestamp(),
  userId: integer().references(() => usersTable.id),
});

export const refreshTokenRelations = relations(refreshTokensTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [refreshTokensTable.userId],
    references: [usersTable.id],
  }),
}));

export const imagesTable = pgTable(
  "images",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer().references(() => usersTable.id, { onDelete: "cascade" }),
    s3Key: varchar().notNull(),
    url: varchar().notNull(),
    metadata: json(),
    views: integer().default(0),
    likesCount: integer().default(0),
    createdAt: timestamp().defaultNow(),
  },
  (table) => ({
    createdAtIndex: index("image_createdAt_index").on(table.createdAt),
  }),
);

export const imageTableRelations = relations(imagesTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [imagesTable.userId],
    references: [usersTable.id],
  }),
}));

export const likesTable = pgTable(
  "likes",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer().references(() => usersTable.id, { onDelete: "cascade" }),
    imageId: integer().references(() => imagesTable.id, { onDelete: "cascade" }),
    createdAt: timestamp().defaultNow(),
  },
  (table) => ({
    uniqueUserImage: unique().on(table.userId, table.imageId),
  }),
);

export const likesTableRelations = relations(likesTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [likesTable.userId],
    references: [usersTable.id],
  }),
  image: one(imagesTable, {
    fields: [likesTable.imageId],
    references: [imagesTable.id],
  }),
}));
