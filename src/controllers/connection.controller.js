import Connection from "../models/connection.model.js"
import User from "../models/user.model.js"

const sendConnectionRequest = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        error: "AUTH_ERROR",
        message: "Unauthorized",
      })
    }

    const fromUser = req.user._id
    const { status, toUser } = req.params

    // Prevent self-connection
    if (String(fromUser) === String(toUser)) {
      return res.status(400).json({
        error: "BUSINESS_RULE_VIOLATION",
        message: "You cannot send a connection request to yourself",
      })
    }

    // Check if target user exists
    const userExists = await User.exists({ _id: toUser })
    if (!userExists) {
      return res.status(404).json({
        error: "NOT_FOUND",
        message: "Target user does not exist",
      })
    }

    // Prevent duplicate connection requests
    const existingConnection = await Connection.exists({
      fromUser,
      toUser,
    })

    if (existingConnection) {
      return res.status(409).json({
        error: "CONFLICT",
        message: "Connection request already exists",
      })
    }

    const connection = await Connection.create({
      fromUser,
      toUser,
      status,
    })

    return res.status(201).json({
      message: "Connection request sent successfully",
      data: connection,
    })
  } catch (error) {
    console.error("Sending connection error:", error)

    return res.status(500).json({
      error: "SERVER_ERROR",
      message: "Something went wrong while sending connection request",
    })
  }
}
const resConnectionRequest = async (req, res) => {
  try {
    const loggedUserId = req.user._id
    const { response, connectionId } = req.params

    // Only the receiver (toUser) can respond
    const connection = await Connection.findOne({
      _id: connectionId,
      toUser: loggedUserId,
    })

    if (!connection) {
      return res.status(403).json({
        error: "AUTH_ERROR",
        message: "You are not authorized to respond to this connection request",
      })
    }

    // Business rule: response allowed only once
    if (connection.status !== "interested") {
      return res.status(409).json({
        error: "CONFLICT",
        message: "This connection request has already been responded to",
      })
    }

    connection.status = response
    await connection.save()

    return res.status(200).json({
      message: "Connection request response updated successfully",
      data: connection,
    })
  } catch (error) {
    console.error("Sending connection response error:", error)

    return res.status(500).json({
      error: "SERVER_ERROR",
      message: "Something went wrong while sending connection response request",
    })
  }
}
const fetchSentConnectionRequest = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1)
    const limit = Math.min(parseInt(req.query.limit) || 20, 50)
    const skip = (page - 1) * limit

    const loggedUserId = req.user._id

    const query = {
      fromUser: loggedUserId,
      status: "interested",
    }

    const [connections, totalCount] = await Promise.all([
      Connection.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({
          path: "toUser",
          select: "fullName photoUrl address age bio skills linkedinUrl",
        })
        .lean(),
      Connection.countDocuments(query),
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return res.status(200).json({
      message: "Sent connection requests fetched successfully",
      data: connections,
      meta: {
        totalCount,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    })
  } catch (error) {
    console.error("Fetching sent connection requests error:", error)

    return res.status(500).json({
      error: "SERVER_ERROR",
      message: "Something went wrong while fetching sent connection requests",
    })
  }
}
const fetchReceivedConnectionRequest = async (req,res)=>{
try {
   const page = Math.max(parseInt(req.query.page) || 1, 1);
const limit = Math.min(parseInt(req.query.limit) || 20, 50);
const skip = (page - 1) * limit;
    if(!req.user?._id){
        return res.status(401).json({
            error : "AUTH_ERROR",
            message : "User not loggedIn",
        })
    }
      const loggedUser = req.user._id
      const query = {
  toUser: loggedUser,
  status: "interested",
}; 
const [connections , totalCount] = await Promise.all([Connection.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).populate({
  path: "fromUser",
  select: "fullName photoUrl address age bio skills linkedinUrl",
}).lean(),Connection.countDocuments(query)])
const totalPages = Math.ceil(totalCount / limit)
      res.status(200).json({
        message : "Received connection requests fetched successfully",
        data : connections,
        meta: {
  totalCount,
  currentPage: page,
  totalPages,
  hasNextPage : page <totalPages,
  hasPrevPage : page > 1,
}
      })
} catch (error) {
    console.error("Fetching received connection error:", error);

    return res.status(500).json({
      error: "SERVER_ERROR",
      message: "Something went wrong during fetching received connection",
    });
  }
}
const fetchMatched = async (req,res)=>{
try { 
    const page = Math.max(parseInt(req.query.page) || 1, 1);
const limit = Math.min(parseInt(req.query.limit) || 20, 50);
const skip = (page - 1) * limit;
    if(!req.user?._id){
        return res.status(401).json({
            error : "AUTH_ERROR",
            message : "User not loggedIn",
        })
    }
          const loggedUser = req.user._id 

    const query = {
        $or : [
            { fromUser : loggedUser , status : "matched"},
            {toUser:loggedUser , status : "matched"}
        ]
    }
      const [connections , totalCount] = await Promise.all([( Connection.find(query)).sort({createdAt : -1}).skip(skip).limit(limit).populate({
  path: "fromUser",
  select: "fullName photoUrl address age bio skills linkedinUrl",
}).populate({
  path: "toUser",
  select: "fullName photoUrl address age bio skills linkedinUrl",
}).lean(), Connection.countDocuments(query)])
const matchedUsersMap = new Map()
for (const connection of connections) {
    const otherUser = String(connection.fromUser._id) === String(loggedUser) ? connection.toUser : connection.fromUser; 
    matchedUsersMap.set(String(otherUser._id), otherUser);

}
const matchedUsers = Array.from(matchedUsersMap.values());
const totalPages = Math.ceil(totalCount/limit)
      res.status(200).json({
        message : "Matched connections fetched successfully",
        data : matchedUsers,
        meta : {
            totalCount,
            totalPages,
            currentPage : page,
            hasNextPage : page <totalPages,
            hasPrevPage : page > 1,

        }
      })
} catch (error) {
    console.log("Fetching matched profiles error : " + error)
    res.status(500).json({
        error : "SERVER_ERROR",
        message : "Error occured while fetching matched profiles"
    })
}
}
const unMatch = async (req, res) => {
  try {
    const loggedUserId = req.user._id
    const { connectionId } = req.params

    // Check if connection exists and logged-in user is part of it
    const connection = await Connection.findOne({
      _id: connectionId,
      status: "matched",
      $or: [
        { fromUser: loggedUserId },
        { toUser: loggedUserId },
      ],
    })

    if (!connection) {
      return res.status(403).json({
        error: "AUTH_ERROR",
        message: "You are not authorized to unmatch this connection",
      })
    }

    await connection.deleteOne()

    return res.status(200).json({
      message: "Connection unmatched successfully",
    })
  } catch (error) {
    console.error("Unmatch connection error:", error)

    return res.status(500).json({
      error: "SERVER_ERROR",
      message: "Something went wrong while unmatching connection",
    })
  }
}
const cancelSentConnectionRequest = async (req, res) => {
  try {
    const loggedUserId = req.user._id
    const { connectionId } = req.params

    // Check if the connection exists and belongs to the logged-in sender
    const connection = await Connection.findOne({
      _id: connectionId,
      fromUser: loggedUserId,
      status: "interested",
    })

    if (!connection) {
      return res.status(403).json({
        error: "AUTH_ERROR",
        message: "You are not authorized to cancel this connection request",
      })
    }

    await connection.deleteOne()

    return res.status(200).json({
      message: "Sent connection request cancelled successfully",
    })
  } catch (error) {
    console.error("Cancel sent connection request error:", error)

    return res.status(500).json({
      error: "SERVER_ERROR",
      message: "Something went wrong while cancelling sent connection request",
    })
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