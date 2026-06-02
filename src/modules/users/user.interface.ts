import { Document } from "mongoose";

export enum Role {
  User = "user",
  PREMIUM_USER = "premiumUser",
  ADMIN = "admin",
}

export interface IUser extends Document {
  name: string;
  username?: string;

  email: string;
  password: string;

  avatar?: string;

  role: Role;

  favorite: string[];
  watchlist: string[];
  recentlyWatched: string[];

  activationCode?: string | null;
  activationCodeExpiry?: Date | null;
  lastActivationCodeSentAt?: Date | null;

  isVerified: boolean;

  // AUTH TOKENS
  refreshToken?: string | null;
  refreshTokenExpiresAt?: Date | null;

  createdAt: Date;
  updatedAt: Date;
}