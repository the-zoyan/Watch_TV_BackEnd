import { User } from "../users/user.modal.js"
import { findUserByEmailForVerification, findUserById, findUserByResetToken, findUsrByEmail, findUsrByEmailForLogin, saveUser } from "../users/user.reposiroty.js"
import { sendMail } from "../../utils/sendMail.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.js";
import jwt from "jsonwebtoken";
import { config } from "../../config/index.js";

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
      lastActivationCodeSentAt: new Date()
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

export const activateUserAccount = async (email: string, activationCode: string) => {
  try {
    const user = await findUserByEmailForVerification(email)
    if (!user) {
      return {
        success: false,
        message: "User not found",
        error: ['No account founf with the provided email address , Please check the email and try again']
      }
    }

    if (user.activationCode !== activationCode) {
      return {
        success: false,
        message: "Invalid activation code",
        error: ['The activation code you provided is incorrect. Please check the code and try again.']
      }
    }

    if (user.activationCodeExpiry && user.activationCodeExpiry < new Date()) {
      return {
        success: false,
        message: "Activation code expired",
        error: ['The activation code has expired. Please request a new code to activate your account.']
      }
    }

    user.isVerified = true;
    user.activationCode = undefined;
    user.activationCodeExpiry = undefined;

    await user.save();

    return {
      success: true,
      message: "Account activated successfully"
    };

  } catch (error) {
    return {
      success: false,
      message: "Account activation failed",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export const resendActivationCode = async (email: string) => {
  try {
    const user = await findUserByEmailForVerification(email)
    if (!user) {
      return {
        success: false,
        message: "User Not Found !",
        error: ['No account found with the provided email address. Please check the email and try again.']
      }
    }
    if (user.isVerified) {
      return {
        success: false,
        message: "Account Already Activated",
        error: ['This account is already activated. Please log in to your account.']
      }
    }
    const COOLDOWN_PERIOD = 1 * 60 * 1000;
    if (user.lastActivationCodeSentAt) {
      const timeSinceLastSent = Date.now() - user.lastActivationCodeSentAt.getTime()
      const remainingTime = COOLDOWN_PERIOD - timeSinceLastSent

      if (timeSinceLastSent < COOLDOWN_PERIOD) {
        const seconds = Math.ceil(Math.max(remainingTime, 0) / 1000)
        return {
          success: false,
          message: "Please wait before requesting a new activation code",
          error: [`You can request a new activation code in ${seconds} seconds.`],
          data: {
            message: `Please wait ${seconds} seconds before requesting a new activation code.`,
            retryAfter: seconds
          }
        }
      }
    }

    const activationCode = crypto.randomBytes(3).toString('hex').toUpperCase()
    user.activationCode = activationCode
    user.activationCodeExpiry = new Date(Date.now() + 10 * 60 * 1000)
    user.lastActivationCodeSentAt = new Date()

    await saveUser(user)

    await sendMail({
      email: user.email,
      subject: "Verify Your Account",
      template: "activation-mail.ejs",
      data: {
        name: user.name,
        activationCode,
      },
    });



    return {
      success: true,
      message: "Activation code resent successfully",
      data: {
        message: "A new activation code has been sent to your email address. Please check your email to activate your account."
      }
    }

  } catch (error: any) {
    return {
      success: false,
      error: [error.message || "An error occurred while resending activation code"],
      message: "Failed to resend activation code"
    }
  }
}


export const loginUser = async (email: string, password: string) => {
  try {
    const normalizedEmail = email.toLowerCase().trim();

    const user = await findUsrByEmailForLogin(normalizedEmail);

    if (!user) {
      return { success: false, message: "Invalid credentials" };
    }

    if (!user.isVerified){
      return { 
        success: false, 
        message: "Account not activated",
        error: ['Your account is not activated yet. Please check your email for the activation code and activate your account before logging in.']
      }
    }

    if (!user.password) {
      return { success: false, message: "Invalid credentials" };
    } 


    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return { success: false, message: "Invalid credentials" };
    }

    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    user.refreshToken = refreshToken;
    user.refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await user.save();

    return {
      success: true,
      accessToken,
      refreshToken,
    };

  } catch (error) {
    return {
      success: false,
      message: "Login failed",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};


export const refreshTokenService = async (refreshToken: string) => {
  try {
    if (!refreshToken) {
      return {
        success: false,
        message: "Unauthorized",
        error: ['No refresh token provided, Please provide a valid refresh token to access this resource.']
      }
    }

    const decoded = jwt.verify(refreshToken, config.jwt_refresh_secret) as { userId: string, email: string, role: string }

    const user = await findUserById(decoded.userId)

    if (!user || user.refreshToken !== refreshToken) {
      return {
        success: false,
        message: "Unauthorized",
        error: ['Invalid refresh token, Please provide a valid refresh token to access this resource.']
      }
    }

    const newAccessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    })

    return {
      success: true,
      accessToken: newAccessToken
    }


  } catch (error) {
    return {
      success: false,
      message: "Unauthorized",
      error: ['Invalid refresh token, Please provide a valid refresh token to access this resource.']
    }
  }
};


export const logoutUserService = async (refreshToken: string) => {
  try {
    const decoded = jwt.verify(refreshToken, config.jwt_refresh_secret) as { userId: string, email: string, role: string }

    const user = await findUserById(decoded.userId)

    if (!user) {
      return {
        success: false,
        message: "Logout failed",
        error: ['User not found, Invalid refresh token. Please provide a valid refresh token to logout.']
      }
    }

    user.refreshToken = null;
    user.refreshTokenExpiresAt = null;
    await user.save()

    return {
      success: true,
      message: "Logout successful"
    }

  } catch (error) {
    return {
      success: false,
      message: "Logout failed",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}


export const forgetPasswordService = async (email: string) => {
  try{
    const user = await findUsrByEmail(email.toLowerCase().trim());

    if(!user){
      return {
        success:false,
        message: "User not found",
        error: ['No account found with the provided email address. Please check the email and try again.']
      }
    }

    const resetToken = crypto.randomBytes(20).toString('hex')
    user.passwordResetToken = resetToken;
    user.passwordResetTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000)

    await user.save()

    await sendMail({
      email: user.email,
      subject: "Password Reset Request",
      template: "forget-password.ejs",
      data: {
        name: user.name,
        resetLink:`${config.client_url}/reset-password/${resetToken}`
      },
    });

    return {
      success: true,
      message: "Password reset email sent successfully",
      data: {
        message: "A password reset link has been sent to your email address. Please check your email to reset your password."
      }
    }


  }catch(error){
    return{
      success: false,
      message: "Failed to process forget password request",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export const resetPasswordService = async (
  token: string,
  password: string
) => {
  try {
    const user = await findUserByResetToken(token);

    if (!user) {
      return {
        success: false,
        message: "Invalid or expired reset token",
        error: [
          "The password reset link is invalid or has expired. Please request a new password reset link.",
        ],
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.passwordResetToken = null;
    user.passwordResetTokenExpiresAt = null;

    await user.save();

    return {
      success: true,
      message: "Password reset successful",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to reset password",
      error: [
        error instanceof Error
          ? error.message
          : "Unknown error",
      ],
    };
  }
};