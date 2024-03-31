"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paidImageRoutes = void 0;
const express_1 = __importDefault(require("express"));
const paidImage_controller_1 = require("./paidImage.controller");
const router = express_1.default.Router();
router.get("/", paidImage_controller_1.paidImageController.getAllPaidImages);
router.get("/:id", paidImage_controller_1.paidImageController.getPaidImageById);
router.post("/", paidImage_controller_1.paidImageController.createPaidImage);
router.put("/:id", paidImage_controller_1.paidImageController.updatePaidImage);
router.delete("/:id", paidImage_controller_1.paidImageController.deletePaidImage);
exports.paidImageRoutes = router;
