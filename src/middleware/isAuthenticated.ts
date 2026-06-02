import { NextFunction, Request , Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

export const IsAuthenticated = (req:Request , res:Response , next:NextFunction) => {
   try{
    const token = req.headers.authorization?.split(" ")[1];
    if(!token){
        return res.status(401).json({
            success:false,
            message:"Unauthorized",
            error:['No token provided, Please provide a valid token to access this resource.']
        })
    }
     
    const decoded = jwt.verify(token , config.jwt_secret) as {userId:string , email:string , role:string};
    
    (req as any).user = decoded;

    next()
   
   }catch(error){
     return res.status(401).json({
            success:false,
            message:"Unauthorized",
            error:['Invalid token, Please provide a valid token to access this resource.']
        })
   }
}