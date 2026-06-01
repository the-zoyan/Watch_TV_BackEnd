import { Request, Response } from "express";
import { RegisterUser } from "./user.serverices.js"; 

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

   }catch(error){
       console.error("Activation Error:", error)
   }
}