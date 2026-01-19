import mongoose , {Schema} from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
const userSchema = new Schema({
    fullName :{
        type : String , 
        required : true,
        trim : true,
        minLength : 2,
        maxLength : 20,
    },
    email : {
        type : String , 
        required : true,
        trim : true,
        unique : true,
        lowercase : true,
    },
    password : {
        type : String,
        required : true,
    },
    photoUrl : {
        type : String,
    },
    address : {
        type : String,
    },
    age : {
        type : Number,
        min : 16,
        max : 100,
    },
    gender : {
        type : String,
        enum : ["Male" , "Female" , "Others"]
    },
    bio : {
        type : String,
    },
   skills: {
      type: [String],
      default: [],
    },
    linkedinUrl :{
        type : String
    },
},{timestamps: true})

userSchema.methods.getJWT = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET,{ expiresIn: "7d" }
  )
}
userSchema.methods.checkPassword = async function (password) {
  return bcrypt.compare(password, this.password)
}
const User = mongoose.model("User",userSchema)

export default User