import User from "../models/user.model.js"
import bcrypt from "bcrypt"

const registerUser = async (req,res)=>{
try {
     const {fullName , email,password} = req.body
     const passwordHash = await bcrypt.hash(password,10)
     const user = await User.create({fullName,email,password : passwordHash})
     const token = user.getJWT()
     res.cookie("token",token)
     res.status(201).json({
        message : "User registered succesfully",
        data : {
            id : user._id,
            fullName : user.fullName,
            email: user.email,
        }
     })
} catch (error) {
    res.status(500).json({
        message : error.message
    })
}



}
const loginUser = async(req,res)=>{
 try {
     const {email,password} = req.body
     const user = await User.findOne({email})
     if(!user){
       return res.status(401).json({
        message : "Incorrect email or password"
     })
     }
     const isPasswordCorrect = await user.checkPassword(password)
     if(isPasswordCorrect){
        const token = user.getJWT()
        res.cookie("token",token)
       return res.status(201).json({
        message : "User registered succesfully",
        data : {
            id : user._id,
            fullName : user.fullName,
            email: user.email,
        }
     })
     }
     res.status(401).json({
        message : "Incorrect email or password"
     })
   
} catch (error) {
    res.status(500).json({
        message : error.message
    })
}
}

export {
    registerUser,
    loginUser
}