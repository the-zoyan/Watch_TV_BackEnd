import jwt from "jsonwebtoken";
import { config } from "../config/index.js";

export const generateAccessToken = (payload: {
  userId: string;
  email: string;
  role: string;
}) => {
  return jwt.sign(payload, config.jwt_secret, {
    expiresIn: config.jwt_expires_in as any,
  });
};

export const generateRefreshToken = (payload: {
  userId: string;
  email: string;
  role: string;
}) => {
  return jwt.sign(payload, config.jwt_refresh_secret, {
    expiresIn: config.jwt_refresh_expires_in as any,
  });
};