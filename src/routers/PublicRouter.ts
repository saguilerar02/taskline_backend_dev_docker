import { Router } from "express";
import { signUp, signIn, sendMailResetPassword, resetUserPassword } from "../controllers/UserController";
import { uploadImageProfileImage } from "../services/MulterConfig";

const publicRouter = Router();

publicRouter.post("/signup",uploadImageProfileImage.single('profileImage'),signUp);
publicRouter.post("/signin",signIn);
publicRouter.post("/resetpassword",sendMailResetPassword);
publicRouter.post("/resetpassword/:user/:token",resetUserPassword);

export default publicRouter;