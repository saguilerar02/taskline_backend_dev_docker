import { Router } from "express";
import { signUp, signIn, sendMailResetPassword, resetUserPassword } from "../controllers/UserController";

const publicRouter = Router();


publicRouter.post("/signup",signUp);
publicRouter.post("/signin",signIn);
publicRouter.post("/resetpassword",sendMailResetPassword);
publicRouter.post("/resetpassword/:user/:token",resetUserPassword);

export default publicRouter;