import express from "express";
import { paidVideoController } from "./paidVideo.controller";

const router = express.Router();

router.get("/", paidVideoController.getAllPaidVideos);
router.get("/:id", paidVideoController.getPaidVideoById);
router.post("/", paidVideoController.createPaidVideo);
router.put("/:id", paidVideoController.updatePaidVideo);
router.delete("/:id", paidVideoController.deletePaidVideo);

export const paidVideoRoutes = router;
