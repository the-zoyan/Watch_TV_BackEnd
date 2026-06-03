import mongoose from "mongoose";
import { IUser } from "./user.interface.js";
import { User } from "./user.modal.js";


export const findUsrByEmail = async (email: string) => {
  return await User.findOne({ email });
};


export const saveUser = async(user:IUser, session?: mongoose.ClientSession):Promise<IUser> => {
      return user.save({session})
}

export const findUserByEmailForVerification = async (email: string):Promise<IUser | null> => {
    return User.findOne({email}).select("+activationCode +activationCodeExpiry + lastActivationCodeSentAt")
};

export const findUsrByEmailForLogin = async (email: string) => {
  return User.findOne({ email }).select("+password");
};


export const findUserById = async (id: string) => {
  return await User.findById(id);
}

export const findUserByResetToken = async (token: string) => {
  return await User.findOne({
    passwordResetToken: token,
    passwordResetExpires: {
      $gt: new Date(),
    },
  }).select("+passwordResetToken +passwordResetExpires");
};