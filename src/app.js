// configDotenv()
import express from "express";
import connectDB from "./config/db.js";
import 'dotenv/config'
import authRouter from "./routes/authRoutes.js";
import cookieParser from "cookie-parser"
// import feedRouter from "./routes/feedRoutes.js";
// import profileRouter from "./routes/profileRoutes.js";
// import connectionRouter from "./routes/connectionRoutes.js";
// import { userAuthMiddleware } from "./middlewares/auth.middleware.js";
const app = express()
const startServer=async()=>{
    await connectDB()
    app.listen(3500,()=>{
        console.log('Server running');
        
    })
}
startServer()
app.use(cookieParser())
app.use(express.json())

app.use("/",authRouter)
// app.use("/",userAuthMiddleware ,feedRouter)
// app.use("/",userAuthMiddleware, profileRouter)
// app.use("/",userAuthMiddleware,connectionRouter)



