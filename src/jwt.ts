import jwt from "jsonwebtoken";
import { Profile, Tokens } from "./types";

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const PUBLIC_KEY = process.env.PUBLIC_KEY;

if (!PUBLIC_KEY || !PRIVATE_KEY) {
  throw new Error("Missing keys!");
}

const SignOpts: jwt.SignOptions = {
  algorithm: "RS256",
  expiresIn: 2 * 24 * 60 * 60, // 2 days
};

export const buildPayload = (tokens: Tokens, user: Profile) => {
  return {
    iss: "cube-hive",
    sub: user.id,
    name: user.name,
    email: user.email,
    wca: {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: tokens.created_at + tokens.expires_in * 1000,
    },
  };
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, PUBLIC_KEY, SignOpts);
};

export const signToken = (payload: any) => {
  return jwt.sign(payload, PRIVATE_KEY, SignOpts);
};
