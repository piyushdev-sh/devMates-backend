import mongoose , { Schema} from "mongoose";

const connectionSchema = new Schema({
  fromUser: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  toUser: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["matched", "ignored", "interested", "rejected"],
    required: true,
  },
}, { timestamps: true })

connectionSchema.index(
  { fromUser: 1, toUser: 1 },
  { unique: true }
)

connectionSchema.index({ toUser: 1, status: 1 })
connectionSchema.index({ fromUser: 1, status: 1 })
connectionSchema.index({ status: 1 })
const Connection = mongoose.model("Connection",connectionSchema)
export default Connection