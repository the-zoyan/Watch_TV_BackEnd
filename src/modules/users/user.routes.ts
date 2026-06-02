import express from 'express'
import { ActivateAccount, Login, refreshTokenController, Register} from './user.controller.js'
import { resendActivationCode } from './user.serverices.js'
const router  = express.Router()

router.post("/register" , Register)
router.post("/activate" , ActivateAccount)
router.post("/resend-activation-code" , resendActivationCode)
router.post("/login" ,  Login)
router.post("/refresh-token" , refreshTokenController)


export default router