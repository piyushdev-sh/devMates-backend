import express ,{Router} from "express";
import { getProfile, meProfile, updateProfile } from "../controllers/userProfile.controller.js";
import { validateUpdateUser } from "../utils/validators.js";

const profileRouter = Router()


profileRouter.patch("/profile/me",validateUpdateUser, updateProfile)
profileRouter.get("/profile/me",meProfile)
profileRouter.get("/profile/:id",getProfile)

export default profileRouter