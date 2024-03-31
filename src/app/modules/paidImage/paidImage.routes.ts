import express from "express";
import { paidImageController } from "./paidImage.controller";

const router = express.Router();

router.get("/", paidImageController.getAllPaidImages);
router.get("/:id", paidImageController.getPaidImageById);
router.post("/", paidImageController.createPaidImage);
router.put("/:id", paidImageController.updatePaidImage);
router.delete("/:id", paidImageController.deletePaidImage);

export const paidImageRoutes = router;
