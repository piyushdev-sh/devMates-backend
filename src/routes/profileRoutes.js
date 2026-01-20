import express ,{Router} from "express";
import { getProfile, meProfile, updateProfile } from "../controllers/userProfile.controller.js";

const profileRouter = Router()


profileRouter.patch("/profile/me",updateProfile)
profileRouter.get("/profile/me",meProfile)
profileRouter.get("/profile/:id",getProfile)

export default profileRouter