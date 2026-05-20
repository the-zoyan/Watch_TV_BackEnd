import mongoose, { Mongoose, Schema, model, models } from "mongoose";
import { IUser, Role } from "./user.interface.js";

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
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

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>("User" , userSchema)
