import User from "../models/user.model.js"
import bcrypt from "bcrypt"

const getProfile= async (req,res)=>{
 try {
    const id = req.params.id
    const user = await User.findById(id).select("-password")
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    res.status(200).json({
        message : "User fetched successfully",
        data : user
    })
 } catch (error) {
    res.status(500).json({
        message : error.message
    })
 }
 
}
const meProfile= async (req,res)=>{
 try {
    const id = req.user._id
    const user = await User.findById(id).select("-password")
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    res.status(200).json({
        message : "User fetched successfully",
        data : user
    })
 } catch (error) {
    res.status(500).json({
        message : error.message
    })
 }
 
}
const updateProfile= async (req,res)=>{
 try {
    const id = req.user._id
    const data = req.body

    const notAllowedUpdates = ["fullName", "email", "age", "gender"]

    notAllowedUpdates.forEach((key) => {
        if (key in data) {
            delete data[key]
        }
    })
    if(data.password){
        const passwordHash = await bcrypt.hash(data.password,10)
        data.password = passwordHash
    }

    const user = await User.findByIdAndUpdate(
        id,
        data,
        { new: true,returnDocument : "after", runValidators: true }
    ).select("-password")
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    res.status(200).json({
        message: "User updated successfully",
        data: user
    })
 } catch (error) {
    res.status(500).json({
        message : error.message
    })
 }
 
}
export {
    getProfile,
    meProfile,
    updateProfile
}