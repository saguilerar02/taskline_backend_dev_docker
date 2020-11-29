import { Router } from "express";
import { signUp, signIn, sendMailResetPassword, resetUserPassword } from "../controllers/UserController";
import express from 'express'
const publicRouter = Router();


publicRouter.post("/signup",signUp);
publicRouter.post("/signin",signIn);
publicRouter.post("/resetpassword",sendMailResetPassword);
publicRouter.post("/resetpassword/:user/:token",resetUserPassword);

publicRouter.use('/static/uploads',express.static('/uploads'))
publicRouter.use('/static/defaults',express.static('/defaults'))

export default publicRouter;