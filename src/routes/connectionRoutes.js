import { Router } from "express";
import { cancelSentConnectionRequest, fetchMatched, fetchReceivedConnectionRequest, fetchSentConnectionRequest, resConnectionRequest, sendConnectionRequest, unMatch } from "../controllers/connection.controller.js";

const connectionRouter = Router()

connectionRouter.get("/connectionRequest/received",fetchReceivedConnectionRequest)
connectionRouter.get("/matches", fetchMatched)
connectionRouter.post("/connectionRequest/:status/:toUser" , sendConnectionRequest)
connectionRouter.post("/connectionRequest/:response/:connectionId",resConnectionRequest)
connectionRouter.get("/connectionRequest/sent",fetchSentConnectionRequest)
connectionRouter.post("/connectionRequest/cancel/:connectionId",cancelSentConnectionRequest)
connectionRouter.post("/matches/unmatch/:connectionId",unMatch)


export default connectionRouter