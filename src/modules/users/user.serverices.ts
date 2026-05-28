import { User } from "./user.modal.js";
import { findUsrByEmail, saveUser } from "./user.reposiroty.js";
import crpto from 'crypto'
import bcrypt from 'bcrypt'

export const RegisterUser = async (userData: { name: string, email: string, password: string }) => {
    try {
        const { name, email, password } = userData;

        if (!name || !email || !password) {
            return {
                success: false,
                message: "Register Failed ",
                error: ['All feiled are required Please try agin !']
            }
        }
        const existinguser = await findUsrByEmail(email)

        if (existinguser) {
            return {
                success: false,
                message: "User Already Exists",
                error: ['User Already Exists ,Please use another email']
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10)


        const newUser = new User({
            name,
            email,
            password: hashedPassword
        })

        const activationCode = crpto.randomBytes(3).toString('hex').toUpperCase();
        newUser.activationCOde = activationCode;
        newUser.activationCodeExpiry = new Date(Date.now() + 10 * 60 * 1000)
        await saveUser(newUser)
         
        

        return {
            success: true,
            data: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            },
            message: "User Register successfully !"
        }
    }catch(error){
        return{
            success:false,
            message:"An error occured during registration",
            error:[error instanceof Error ? error.message : "Unknown Error"],
        }
    }

}