import { User } from "../users/user.modal.js"
import {findUsrByEmail} from "../users/user.reposiroty.js"
import { sendMail } from "../../utils/sendMail.js";
import crypto from "crypto";
import bcrypt from "bcrypt";

export const RegisterUser = async (userData: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    const { name, email, password } = userData;

    if (!name || !email || !password) {
      return {
        success: false,
        message: "All fields are required",
      };
    }

    const normalizedEmail = email.toLowerCase().trim();

  
    const existingUser = await findUsrByEmail(normalizedEmail);

    if (existingUser) {
      return {
        success: false,
        message: "User already exists",
      };
    }


    const hashedPassword = await bcrypt.hash(password, 10);


    const activationCode = crypto
      .randomBytes(3)
      .toString("hex")
      .toUpperCase();

    const newUser = new User({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      activationCode, 
      activationCodeExpiry: new Date(Date.now() + 10 * 60 * 1000), 
      isVerified: false,
    });

    await newUser.save();

 
    await sendMail({
      email: newUser.email,
      subject: "Verify Your Account",
      template: "activation-mail.ejs",
      data: {
        name: newUser.name,
        activationCode,
      },
    });

    return {
      success: true,
      message: "Registration successful. Verification email sent.",
    };
    
  } catch (error) {
    console.error("Registration Error:", error);

    return {
      success: false,
      message: "Registration failed",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}; 