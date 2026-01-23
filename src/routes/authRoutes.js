import express ,{Router} from "express";
import { validateLoginUser, validateRegisterUser } from "../utils/validation/AuthValidators.js";
import { loginUser, logoutUser, registerUser } from "../controllers/auth.controller.js";

const authRouter = Router()


authRouter.post("/register" , validateRegisterUser, registerUser )
authRouter.post("/login",validateLoginUser,loginUser)
authRouter.post("/logout" , logoutUser)
export default authRouter
