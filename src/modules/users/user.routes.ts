import express from 'express'
import { ActivateAccount, Register } from './user.controller.js'
const router  = express.Router()

router.post("/register" , Register)
router.post("/activate" , ActivateAccount)

export default router