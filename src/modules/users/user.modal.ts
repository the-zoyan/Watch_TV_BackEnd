import mongoose, { Schema } from "mongoose";
import { IUser, Role } from "./user.interface.js";

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    avatar: {
      type: String,
      default: "https://i.ibb.co.com/DD63MqLK/user.webp",
    },

    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.User,
    },

    favorite: {
      type: [String],
      default: [],
    },

    watchlist: {
      type: [String],
      default: [],
    },

    recentlyWatched: {
      type: [String],
      default: [],
    },

    activationCode: {
      type: String,
      default: null,
      select: false,
    },

    activationCodeExpiry: {
      type: Date,
      default: null,
      select: false,
    },

    lastActivationCodeSentAt: {
      type: Date,
      default: null,
      select: false,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>("User", userSchema);