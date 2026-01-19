import express ,{Router} from "express";
import { validateLoginUser, validateRegisterUser } from "../utils/validators.js";
import { loginUser, registerUser } from "../controllers/auth.controller.js";

const authRouter = Router()


authRouter.post("/register" , validateRegisterUser, registerUser )
authRouter.post("/login",validateLoginUser,loginUser)
// authRouter.post("/logout")
export default authRouter
