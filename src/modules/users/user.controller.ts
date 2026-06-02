import { Request, Response } from "express";
import { activateUserAccount, RegisterUser, resendActivationCode } from "./user.serverices.js"; 

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

export const ResendActivationCode = async (req: Request, res: Response) => {
  try{
    const { email } = req.body;
     
    if(!email){
      return res.status(400).json({
        success:false,
        message:"Email is required",
        error:['Please provide a valid email address to resend the activation code.']
      })
    }

    const result = await resendActivationCode(email);

    if (!result?.success) {
      return res.status(400).json({ 
        success: false, 
        message: result.message || "Resend Activation Code Failed" 
      });
    }

    return res.status(200).json({ 
      success: result.success, 
      message: result.message 
    }); 
  }catch(error){
      console.error("Resend Activation Code Error:", error)
      res.status(500).json({ message: "Internal Server Error!" });
  }
}