import express ,{Router} from "express";

const profileRouter = Router()


profileRouter.patch("/profile")
profileRouter.get("/profile/:id")
export default profileRouter