import express from 'express'
import { ActivateAccount, ForgetPassword, Login, logoutUser, refreshTokenController, Register, ResetPassword} from './user.controller.js'
import { resendActivationCode } from './user.serverices.js'
const router  = express.Router()

router.post("/register" , Register)
router.post("/activate" , ActivateAccount)
router.post("/resend-activation-code" , resendActivationCode)
router.post("/login" ,  Login)
router.post("/refresh-token" , refreshTokenController)
router.post("/logout" , logoutUser)
router.post("/forget-password" , ForgetPassword)
router.post("/reset-password" , ResetPassword)




export default router