import Connection from "../models/connection.model.js"

const sendConnectionRequest = async (req,res)=>{
  try {
    const fromUser = req.user._id 
    const {status , toUser} = req.params
    const connection = await Connection.create({fromUser,toUser,status})
    res.status(201).json({message : "Connection request sent successfully",data : connection})
  } catch (error) {
    throw new Error("Failed to send connection request")
  }
}
const resConnectionRequest = async(req,res)=>{
   try {
    const {response , connectionId} = req.params
    const connection = await Connection.findByIdAndUpdate(connectionId,{status : response},{returnDocument : "after"})
    res.status(200).json({message : "Connection request response updated successfully" , data : connection})
   } catch (error) {
     throw new Error("Failed to respond to connection request")
   }
}
const fetchSentConnectionRequest = async (req,res)=>{
try {
      const loggedUser = req.user._id
      const connections = await Connection.find({fromUser : loggedUser , status : "interested"})
      res.status(200).json({
        message : "Sent connection requests fetched successfully",
        data : connections
      })
} catch (error) {
    throw new Error("Failed to fetch sent connection requests")
}
}
const fetchReceivedConnectionRequest = async (req,res)=>{
try {
      const loggedUser = req.user._id
      const connections = await Connection.find({toUser : loggedUser , status : "interested"})
      res.status(200).json({
        message : "Received connection requests fetched successfully",
        data : connections
      })
} catch (error) {
    throw new Error("Failed to fetch received connection requests")
}
}
const fetchMatched = async (req,res)=>{
try {
      const loggedUser = req.user._id
      const connections = await Connection.find({
        $or : [
            { fromUser : loggedUser , status : "matched"},
            {toUser:loggedUser , status : "matched"}
        ]
      })
      res.status(200).json({
        message : "Matched connections fetched successfully",
        data : connections
      })
} catch (error) {
    throw new Error("Failed to fetch matched connections")
}
}
const unMatch = async (req,res)=>{
     try {
    const {connectionId} = req.params
    const connection = await Connection.findByIdAndUpdate(connectionId,{status : "unmatch"},{returnDocument : "after"})
    res.status(200).json({message : "Connection unmatched successfully" , data : connection})
   } catch (error) {
     throw new Error("Failed to unmatch connection")
   }
}
const cancelSentConnectionRequest = async (req,res)=>{
      try {
    const {connectionId} = req.params
    const connection = await Connection.findByIdAndDelete(connectionId)
    res.status(200).json({message : "Sent connection request cancelled successfully" , data : connection})
   } catch (error) {
     throw new Error("Failed to cancel sent connection request")
   }
}

export {
    sendConnectionRequest,
    resConnectionRequest,
    fetchMatched,
    fetchSentConnectionRequest,
    fetchReceivedConnectionRequest,
    unMatch,
    cancelSentConnectionRequest
}