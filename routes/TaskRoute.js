import { Router } from "express";
import { createTask, deleteTask, getTasksByUser, updateTask } from "../controllers/TaskController.js";

const router = Router();

router.get("/:userId", getTasksByUser);
router.post("/:userId", createTask);
router.put("/:userId/:taskId", updateTask);
router.delete("/:userId/:taskId", deleteTask);

export default router;