import { usersTable } from "../db/schema";
import { eq } from "drizzle-orm";
import db from "../db";
import bcrypt from "bcrypt";
import { signPayload } from "../utils";

const register = async ({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name: string;
}) => {
  const existUser = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email.toLowerCase()));
  if (existUser.length) throw new Error("User already exists");
  const hash = await bcrypt.hash(password, 10);
  const [user] = await db
    .insert(usersTable)
    .values({ name, email: email.toLowerCase(), password: hash, role: "user" })
    .returning();
  return signPayload({ id: user.id, email: user.email, role: user.role });
};

const login = async ({ email, password }: { email: string; password: string }) => {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email.toLowerCase()));
  if (!user) throw new Error("User does not exist");
  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("invalid credentials");
  return signPayload({ id: user.id, email: user.email, role: user.role });
};

export { register, login };
