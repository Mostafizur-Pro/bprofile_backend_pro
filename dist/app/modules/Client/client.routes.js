"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientRoutes = void 0;
const express_1 = __importDefault(require("express"));
const client_controller_1 = require("./client.controller");
const router = express_1.default.Router();
router.get("/", client_controller_1.clientController.getAllClients);
router.get("/all", client_controller_1.clientController.getAllClientData);
router.get("/:id", client_controller_1.clientController.getClientById);
router.post("/", client_controller_1.clientController.createClient);
router.put("/:id", client_controller_1.clientController.updateClient);
router.delete("/:id", client_controller_1.clientController.deleteClient);
exports.clientRoutes = router;
