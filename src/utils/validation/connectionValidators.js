import mongoose from "mongoose"


const ALLOWED_STATUS_REQ = ["interested", "ignored"]
const ALLOWED_STATUS_RES = ["rejected", "matched"]


const validateSendingConnectionRequest = (req, res, next) => {
  const { status, toUser } = req.params

  if (!status) {
    return res.status(400).json({
      error: "VALIDATION_ERROR",
      message: "status is required",
      field: "status",
    })
  }

  if (!toUser) {
    return res.status(400).json({
      error: "VALIDATION_ERROR",
      message: "toUser is required",
      field: "toUser",
    })
  }

  if (typeof status !== "string") {
    return res.status(400).json({
      error: "VALIDATION_ERROR",
      message: "status must be a string",
      field: "status",
    })
  }

  if (typeof toUser !== "string") {
    return res.status(400).json({
      error: "VALIDATION_ERROR",
      message: "toUser must be a string",
      field: "toUser",
    })
  }

  const normalizedStatus = status.trim().toLowerCase()
  const normalizedToUser = toUser.trim()

  if (!ALLOWED_STATUS_REQ.includes(normalizedStatus)) {
    return res.status(400).json({
      error: "VALIDATION_ERROR",
      message: `status must be one of: ${ALLOWED_STATUS_REQ.join(", ")}`,
      field: "status",
    })
  }

  if (!mongoose.Types.ObjectId.isValid(normalizedToUser)) {
    return res.status(400).json({
      error: "VALIDATION_ERROR",
      message: "Invalid toUser id format",
      field: "toUser",
    })
  }

  req.params.status = normalizedStatus
  req.params.toUser = normalizedToUser

  next()
}
const validateResConnectionRequest = (req, res, next) => {
  const { response, connectionId } = req.params

  if (!response) {
    return res.status(400).json({
      error: "VALIDATION_ERROR",
      message: "response is required",
      field: "response",
    })
  }

  if (!connectionId) {
    return res.status(400).json({
      error: "VALIDATION_ERROR",
      message: "connectionId is required",
      field: "connectionId",
    })
  }

  if (typeof response !== "string") {
    return res.status(400).json({
      error: "VALIDATION_ERROR",
      message: "response must be a string",
      field: "response",
    })
  }

  if (typeof connectionId !== "string") {
    return res.status(400).json({
      error: "VALIDATION_ERROR",
      message: "connectionId must be a string",
      field: "connectionId",
    })
  }

  const normalizedResponse = response.trim().toLowerCase()
  const normalizedConnectionId = connectionId.trim()

  if (!ALLOWED_STATUS_RES.includes(normalizedResponse)) {
    return res.status(400).json({
      error: "VALIDATION_ERROR",
      message: `response must be one of: ${ALLOWED_STATUS_RES.join(", ")}`,
      field: "response",
    })
  }

  if (!mongoose.Types.ObjectId.isValid(normalizedConnectionId)) {
    return res.status(400).json({
      error: "VALIDATION_ERROR",
      message: "Invalid connectionId format",
      field: "connectionId",
    })
  }

  req.params.response = normalizedResponse
  req.params.connectionId = normalizedConnectionId

  next()
}
export {
    validateSendingConnectionRequest,
    validateResConnectionRequest
}