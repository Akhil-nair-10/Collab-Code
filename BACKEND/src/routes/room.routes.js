import express from "express";
import roomController from "../controllers/room.controller.js";
import verifyUser from "../middlewares/auth.middlware.js";

const router = express.Router();

router.post("/create_room", verifyUser, roomController.CreateRoom);
router.post("/join_room",  verifyUser, roomController.JoinRoom);
router.get("/:roomId", roomController.GetRoom);
router.delete("/:roomId/end", verifyUser, roomController.EndRoom);
router.delete("/:roomId/leave", verifyUser, roomController.LeaveRoom);

export default router;