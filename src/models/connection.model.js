import mongoose , { Schema} from "mongoose";

const connectionSchema = new Schema({
    fromUser : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    toUser : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    status : {
        type : String,
        enum : ["matched","ignore","interested","rejected","unmatched"]
    }
})
const Connection = mongoose.model("Connection",connectionSchema)
export default Connection