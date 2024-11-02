import { Router } from "express";
import { createNote, deleteNote, getNotesByUser, updateNote } from "../controllers/NoteController.js";

const router = Router();

router.get("/:userId", getNotesByUser);
router.post("/", createNote);
router.put("/:noteId", updateNote);
router.delete("/:noteId", deleteNote);

export default router;