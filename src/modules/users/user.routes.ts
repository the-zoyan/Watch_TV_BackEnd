import express from 'express'
import { Register } from './user.controller.js'
const router  = express.Router()

router.post("/register" , Register)