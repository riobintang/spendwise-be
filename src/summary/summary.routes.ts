import { Router } from "express";
import * as summaryController from "./summary.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/", authMiddleware, summaryController.getSummary);

export default router;
