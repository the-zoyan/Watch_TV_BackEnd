import mongoose from "mongoose"
import { config } from "./index.js"

export const connectDB = async()=> {
    try{
          await mongoose.connect(config.db)
           console.log("Database Connection SuccessFully !")
    }catch(error){
        console.error("Database Connection Failed:", error)
        process.exit(1)
    }
}


