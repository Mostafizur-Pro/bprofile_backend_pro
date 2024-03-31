"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paidVideoRoutes = void 0;
const express_1 = __importDefault(require("express"));
const paidVideo_controller_1 = require("./paidVideo.controller");
const router = express_1.default.Router();
router.get("/", paidVideo_controller_1.paidVideoController.getAllPaidVideos);
router.get("/:id", paidVideo_controller_1.paidVideoController.getPaidVideoById);
router.post("/", paidVideo_controller_1.paidVideoController.createPaidVideo);
router.put("/:id", paidVideo_controller_1.paidVideoController.updatePaidVideo);
router.delete("/:id", paidVideo_controller_1.paidVideoController.deletePaidVideo);
exports.paidVideoRoutes = router;
