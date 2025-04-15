import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

export const signPayload = (payload: object) => jwt.sign(payload, SECRET, { expiresIn: "7d" });
export const verifyJwt = (token: string) => jwt.verify(token, SECRET);
