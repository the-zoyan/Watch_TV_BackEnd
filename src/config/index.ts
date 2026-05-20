import dotenv from 'dotenv'
dotenv.config()

interface Config{
    port:number,
    db:string
}

export const config:Config = {
   port:Number(process.env.PORT) || 3000,
   db:process.env.DATABASE_URL!
} 