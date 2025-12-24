import { Router } from "express";
import * as categoryController from "./category.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/", authMiddleware, categoryController.listCategories);
router.post("/", authMiddleware, categoryController.createCategory);
router.get("/:id", authMiddleware, categoryController.getByIdCategory);
// router.put("/:id", categoryController.updateCategory);
// router.delete("/:id", categoryController.deleteCategory);
export default router;
