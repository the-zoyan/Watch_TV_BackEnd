import express from 'express'
import { ActivateAccount, Register} from './user.controller.js'
import { resendActivationCode } from './user.serverices.js'
const router  = express.Router()

router.post("/register" , Register)
router.post("/activate" , ActivateAccount)
router.post("/resend-activation-code" , resendActivationCode)


export default router