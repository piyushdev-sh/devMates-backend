import { Router } from "express";

const connectionRouter = Router()

connectionRouter.get("/connectionRequest/received")
connectionRouter.get("/matches")
connectionRouter.post("/connectionRequest/send/:id")
connectionRouter.post("/connectionRequest/ignore/:id")
connectionRouter.post("/connectionRequest/reject/:id")
connectionRouter.get("/connectionRequest/sent")
connectionRouter.post("/connectionRequest/accept/:id")
connectionRouter.post("/connectionRequest/cancel/:id")
connectionRouter.post("/matches/unmatch/:id")


export default connectionRouter