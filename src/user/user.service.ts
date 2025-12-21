import { Login, User } from "./user.type";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "../../generated/prisma/client";
import createHttpError from "http-errors";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const prisma = new PrismaClient();

export async function register(data: {
  email: string;
  name: string;
  password: string;
}): Promise<Omit<User, "password">> {
  if (!data.email || !data.password || !data.name)
    throw createHttpError(400, "Email, name, and password required");
  const existing = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (existing) throw createHttpError(409, "Email already exists");
  const hashed = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      password: hashed,
    },
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export async function login(data: {
  email: string;
  password: string;
}): Promise<Login> {
  if (!data.email || !data.password)
    throw createHttpError(400, "Email and password required");
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) throw createHttpError(401, "Invalid email or password");
  const valid = await bcrypt.compare(data.password, user.password);
  if (!valid) throw createHttpError(401, "Invalid email or password");
  const jwtToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    token: jwtToken,
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
