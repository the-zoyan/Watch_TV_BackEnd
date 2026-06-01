import { Document } from "mongoose";

export enum Role{
    User = "user",
    PREMIUM_USer="premiumUser",
    ADMIN="admin",
}

export interface IUser extends Document{
  id: string;

  name: string;
  username: string;

  email: string;
  password: string;

  avatar?: string;

  role: Role

  favorite?: string[];
  watchlist?: string[];
  recentlyWatched?: string[];
  activationCode?:string | null;
  activationCodeExpiry:Date | null
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

