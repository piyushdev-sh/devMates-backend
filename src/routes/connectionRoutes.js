import { Router } from "express";
import { cancelSentConnectionRequest, fetchMatched, fetchReceivedConnectionRequest, fetchSentConnectionRequest, resConnectionRequest, sendConnectionRequest, unMatch } from "../controllers/connection.controller.js";
import { validateResConnectionRequest, validateSendingConnectionRequest } from "../utils/validation/connectionValidators.js";

const connectionRouter = Router()

connectionRouter.get("/connectionRequest/received",fetchReceivedConnectionRequest)
connectionRouter.get("/matches", fetchMatched)
connectionRouter.post("/connectionRequest/:status/:toUser" ,validateSendingConnectionRequest, sendConnectionRequest)
connectionRouter.post("/connectionRequest/:response/:connectionId",validateResConnectionRequest,resConnectionRequest)
connectionRouter.get("/connectionRequest/sent",fetchSentConnectionRequest)
connectionRouter.post("/connectionRequest/cancel/:connectionId",cancelSentConnectionRequest)
connectionRouter.post("/matches/unmatch/:connectionId",unMatch)


export default connectionRouter