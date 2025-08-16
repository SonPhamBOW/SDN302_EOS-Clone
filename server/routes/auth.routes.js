import { Router } from "express";
import * as authController from '../controller/auth.controller.js'
const authRouter = Router();

authRouter.route('/auth/signup').post(authController.signUp)
authRouter.route('/auth/signin').post(authController.signIn)
authRouter.route('/auth/signout').post(authController.signOut)
authRouter.route('/auth/verifyEmail').post(authController.verifyEmail)

export default authRouter