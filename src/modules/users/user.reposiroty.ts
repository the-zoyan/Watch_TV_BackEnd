import mongoose from "mongoose";
import { IUser } from "./user.interface.js";
import { User } from "./user.modal.js";


export const findUsrByEmail = async (email: string) => {
  return await User.findOne({ email });
};


export const saveUser = async(user:IUser, session?: mongoose.ClientSession):Promise<IUser> => {
      return user.save({session})
}
