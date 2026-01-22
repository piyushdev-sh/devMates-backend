import User from "../models/user.model.js"
import mongoose from "mongoose";

const getProfile= async (req,res)=>{
 try {
    const id = req.params.id
    if (!mongoose.Types.ObjectId.isValid(id)) {
  return res.status(400).json({
    error: "VALIDATION_ERROR",
    message: "Invalid user id",
  });
}
    const user = await User.findById(id).select("-password fullName photoUrl bio skills age gender linkedinUrl address")
    if (!user) {
      return res.status(404).json({
  "error": "NOT_FOUND",
  "message": "User not found"
})
    }
    res.status(200).json({
        message : "User fetched successfully",
        data : user
    })
 }  catch (error) {
    console.error("getting profile error:", error);

    return res.status(500).json({
      error: "SERVER_ERROR",
      message: "Something went wrong while fetching profile",
    });
  }
 
}
const meProfile = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        error: "AUTH_ERROR",
        message: "Unauthorized",
      });
    }

    const user = await User.findById(req.user._id)
      .select("-password");

    if (!user) {
      return res.status(401).json({
        error: "AUTH_ERROR",
        message: "Session expired or user not found",
      });
    }

    return res.status(200).json({
      message: "User fetched successfully",
      data: user,
    });

  } catch (error) {
    console.error("Me profile error:", error);

    return res.status(500).json({
      error: "SERVER_ERROR",
      message: "Something went wrong while fetching profile",
    });
  }
};
const updateProfile = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        error: "AUTH_ERROR",
        message: "Unauthorized",
      });
    }

    const userId = req.user._id;
    const updateData = req.validatedData;
    if (!updateData || Object.keys(updateData).length === 0) {
  return res.status(400).json({
    error: "VALIDATION_ERROR",
    message: "No data provided for update",
  });
}
    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        error: "NOT_FOUND",
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User updated successfully",
      data: user,
    });

  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      error: "SERVER_ERROR",
      message: "Something went wrong while updating profile",
    });
  }
};
export {
    getProfile,
    meProfile,
    updateProfile
}