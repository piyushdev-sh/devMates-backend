import mongoose from "mongoose"

const connectDB= async ()=>{
  try {
      await mongoose.connect(process.env.MONGO_URL)
      console.log('DB connected');
  } catch (error) {
    throw new Error("Not able to connect to db")
  }
    }

export default connectDB