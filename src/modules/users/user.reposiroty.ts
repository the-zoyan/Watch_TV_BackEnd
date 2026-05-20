import { User } from "./user.modal.js";


export const findUserByEmail = async (email: string) => {
  return await User.findOne({ email });
};