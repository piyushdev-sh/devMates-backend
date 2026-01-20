import jwt from "jsonwebtoken"
import User from "../models/user.model.js"
const userAuthMiddleware = async (req,res,next)=>{
  try {
    const {token} = req.cookies
    if(!token){
        throw new Error("Unauthorized")
    }
  const decoded = jwt.verify(token,process.env.JWT_SECRET)
  const user = await User.findById(decoded._id)
  req.user = user
  next()
  } catch (error) {
    res.status(401).json({
        message : "Unauthorized access"
    })
  }
}

export {
    userAuthMiddleware
}