// We Only declare Api's Here. Not define them here 
import * as authController from "../controllers/auth.controller.js";

import { Router } from "express";
const authRouter = Router();


// Post api /api/auth/register
authRouter.post('/register',authController.register);
authRouter.get('/all_users',authController.all_users);
authRouter.get('/get-me',authController.getMe);
authRouter.get('/refresh-token',authController.refreshToken);
authRouter.get('/log-out',authController.logOut)


export default authRouter;
