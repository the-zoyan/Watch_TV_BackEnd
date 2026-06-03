import { Request, Response } from "express";
import { activateUserAccount, forgetPasswordService, loginUser, logoutUserService, refreshTokenService, RegisterUser, resendActivationCode } from "./user.serverices.js"; 

export const Register = async (req: Request, res: Response) => {
  try {
    const result = await RegisterUser(req.body);
    
    if (!result?.success) {
      return res.status(400).json({ 
        success: false, 
        message: result.message || "Registration Failed" 
      });
    }

    return res.status(201).json({ 
      success: result.success, 
      message: result.message 
    });

  } catch (error) {
    console.error("Controller Error:", error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};


export const ActivateAccount = async (req: Request, res: Response) => {
   try{
      const { email, activationCode } = req.body;
      const result = await activateUserAccount(email, activationCode);
      
      if (!result?.success) {
        return res.status(400).json({ 
          success: false, 
          message: result.message || "Activation Failed" 
        });
      }
      return res.status(200).json({ 
        success: result.success, 
        message: result.message 
      });   

   }catch(error){
       console.error("Activation Error:", error)
   }
}

export const ResendActivationCode = async (req:Request ,res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
        error: [
          "Please provide a valid email address to resend the activation code.",
        ],
      });
    }

    const result = await resendActivationCode(email);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
        error: result.error,
        data: result.data,
      });
    }

    return res.status(200).json({
      success: true,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error("Resend Activation Code Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const Login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await loginUser(email, password);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: false, 
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken: result.accessToken,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export const refreshTokenController = async (req: Request, res: Response) => {
  try{
     
    const refreshToken = req.cookies.refreshToken;
    
    const result = await refreshTokenService(refreshToken);

    if (!result.success) {
      return res.status(401).json({
        success: false,
        message: result.message || "Unauthorized",
        error: result.error || ['Invalid refresh token, Please provide a valid refresh token to access this resource.']
      });
    }

    return res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      accessToken: result.accessToken,
    });
  }catch(error){

  }
}

export const logoutUser = async (req: Request, res: Response) => {
  try{
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Bad Request",
        error: ['No refresh token provided, Please provide a valid refresh token to logout.']
      });
    }
    
    const result = await logoutUserService(refreshToken);
    
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false, 
      sameSite: "strict",
    })
    
    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });


  }catch(error){
   return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
}


export const ForgetPassword = async(req:Request , res:Response) => {
  try{
     const {email} = req.body;
     if(!email){
      return res.status(400).json({
        success:false,
        message:"Email is required",
        error:['Please provide a valid email address to reset your password.']
      })
     }
     
     const result = await forgetPasswordService(email)


  }catch(error){
    return{
      success:false,
      message:"Failed to process password reset request",
      error:['An error occurred while processing your password reset request. Please try again later.']
    }
  }
}


export const ResetPassword = async(req:Request , res:Response) => {
  try{

  }catch(error){
    return{
      success:false,
      message:"Failed to reset password",
      error:['An error occurred while resetting your password. Please try again later.']
    }
  }
}