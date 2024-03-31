"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hallRoomPostRoutes = void 0;
const express_1 = __importDefault(require("express"));
const hallRoom_controller_1 = require("./hallRoom.controller");
const router = express_1.default.Router();
router.get("/", hallRoom_controller_1.hallRoomController.getAllHallRooms);
router.get("/:id", hallRoom_controller_1.hallRoomController.getHallRoomById);
router.post("/", hallRoom_controller_1.hallRoomController.createHallRoom);
router.put("/:id", hallRoom_controller_1.hallRoomController.updateHallRoom);
router.delete("/:id", hallRoom_controller_1.hallRoomController.deleteHallRoom);
exports.hallRoomPostRoutes = router;
