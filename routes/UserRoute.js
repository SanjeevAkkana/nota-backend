import { Router } from "express";
import { createUser, forgotPassword, getAllUsers, loginUser, resendOTP, verifyAccount } from "../controllers/UserControllers.js";

const router = Router();

router.get("/", getAllUsers);
router.post("/register", createUser);
router.post("/verify", verifyAccount);
router.post("/send-otp", resendOTP);
router.post("/login",loginUser);
router.post("/forgot-password", forgotPassword);

export default router;