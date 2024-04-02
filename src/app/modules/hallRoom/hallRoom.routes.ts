import express from "express";
import { hallRoomController } from "./hallRoom.controller";

const router = express.Router();

router.get("/", hallRoomController.getAllHallRooms);
router.get("/all", hallRoomController.getAllHallRoomData);
router.get("/:id", hallRoomController.getHallRoomById);
router.post("/", hallRoomController.createHallRoom);
router.put("/:id", hallRoomController.updateHallRoom);
router.delete("/:id", hallRoomController.deleteHallRoom);

export const hallRoomPostRoutes = router;
