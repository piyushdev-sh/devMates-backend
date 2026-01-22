import User from "../models/user.model.js"
import bcrypt from "bcrypt"

const registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.validatedData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        error: "CONFLICT",
        message: "Email already registered",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      password: passwordHash,
    });

    const token = user.getJWT();

    res.cookie("token", token)

    return res.status(201).json({
      message: "User registered successfully",
      data: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Register user error:", error);

    return res.status(500).json({
      error: "SERVER_ERROR",
      message: "Something went wrong during registration",
    });
  }
};
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.validatedData;

    const user = await User.findOne({ email }).select("+password fullName email");
    if (!user) {
      return res.status(401).json({
        error: "AUTH_ERROR",
        message: "Incorrect email or password",
      });
    }

    const isPasswordCorrect = await user.checkPassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        error: "AUTH_ERROR",
        message: "Incorrect email or password",
      });
    }

    const token = user.getJWT();

    res.cookie("token", token )

    return res.status(200).json({
      message: "Login successful",
      data: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login user error:", error);

    return res.status(500).json({
      error: "SERVER_ERROR",
      message: "Something went wrong during login",
    });
  }
};
const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token")

    return res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout user error:", error);

    return res.status(500).json({
      error: "SERVER_ERROR",
      message: "Something went wrong during logout",
    });
  }
};

export {
    registerUser,
    loginUser,
    logoutUser
}