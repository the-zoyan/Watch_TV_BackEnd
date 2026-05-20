import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
const app  = express()

// middleware
app.use(express.json())
app.use(cors())
app.use(cookieParser())



app.get("/" , (req , res) => {
    res.status(201).json({message:"Welcome To watch-tv  Backend !"})
})



export default app
