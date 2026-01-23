import Connection from "../models/connection.model"
import User from "../models/user.model"

const getFeed = async (req, res) => {
  try {
    const loggedUserId = req.user._id

    // Pagination
    const page = Math.max(parseInt(req.query.page) || 1, 1)
    const limit = Math.min(parseInt(req.query.limit) || 20, 50)
    const skip = (page - 1) * limit

    /**
     * STEP 1: Find all users that should be excluded from feed
     * - self
     * - users I sent request to (interested / rejected)
     * - users who sent request to me (ignored)
     * - matched users
     */
    const connections = await Connection.find({
      $or: [
        { fromUser: loggedUserId },
        { toUser: loggedUserId },
      ],
    }).select("fromUser toUser status")

    const excludedUserIds = new Set()
    excludedUserIds.add(String(loggedUserId))

    for (const connection of connections) {
      if (String(connection.fromUser) === String(loggedUserId)) {
        excludedUserIds.add(String(connection.toUser))
      } else {
        excludedUserIds.add(String(connection.fromUser))
      }
    }

    /**
     * STEP 2: Fetch random users excluding the above users
     */
    const users = await User.aggregate([
      {
        $match: {
          _id: { $nin: Array.from(excludedUserIds).map(id => new mongoose.Types.ObjectId(id)) },
        },
      },
      { $sample: { size: limit } }, // random users every time
      {
        $project: {
          fullName: 1,
          photoUrl: 1,
          age: 1,
          bio: 1,
          skills: 1,
          address: 1,
          linkedinUrl: 1,
        },
      },
    ])

    return res.status(200).json({
      message: "Feed fetched successfully",
      data: users,
      meta: {
        currentPage: page,
        limit,
      },
    })
  } catch (error) {
    console.error("Fetching feed error:", error)

    return res.status(500).json({
      error: "SERVER_ERROR",
      message: "Something went wrong while fetching feed",
    })
  }
}
export {
    getFeed
}