import { Request, Response } from "express";
import { RegisterUser } from "./user.serverices.js";

export const Register = async(req:Request , res:Response) => {
   try{
      const result = await RegisterUser(req.body)
      if(!result?.success){
        return  res.status(400).json({message:"User Authentication Failed !"})
      }
     
      return res.status(201).json({success:result.success , data:result.data , message:result.message})

   }catch(error){
      res.status(500).json({message:"internal server Error !"})
      console.error("something Wrong ! Please check " , error)
   }
}
