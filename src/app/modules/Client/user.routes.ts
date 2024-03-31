import express from "express";
import { clientController } from "./user.controller";


const router = express.Router();

router.get("/", clientController.getAllClients);
router.get("/:id", clientController.getClientById);
router.post("/", clientController.createClient);
router.put("/:id", clientController.updateClient);
router.delete("/:id", clientController.deleteClient);

export const clientRoutes = router;
