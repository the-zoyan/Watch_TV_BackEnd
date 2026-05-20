import { User } from "./user.modal.js";
import { findUserByEmail} from "./user.reposiroty.js";
import bcrypt from 'bcrypt'

export const RegisterUser = async(userData:{name:string, email:string , password:string}) => {
    const {name , email , password} = userData;
    
    if(!name || !email || !password){
        return{
            success:false,
            message:"Register Failed ",
            error:['All feiled are required Please try agin !']
        }
    }
    const existinguser = await findUserByEmail(email)

    if(existinguser){
        return{
            success:false,
            message:"User Already Exists",
            error:['User Already Exists ,Please use another email']
        }
    }
    
    const hashedPassword = await bcrypt.hash(password , 10)
   
    const newUser = new User({
        name,
        email,
        password:hashedPassword
    })
   
    await newUser.save()

    return{
        success:true,
        data:{
          id:newUser._id,
          name:newUser.name,
          email:newUser.email
        },
        message:"User Register successfully !"
    }

}