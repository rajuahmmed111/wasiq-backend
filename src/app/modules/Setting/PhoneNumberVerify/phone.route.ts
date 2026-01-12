import express from "express";
import { OtpController } from "./phone.controller";
import auth from "../../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

// send otp to phone number
router.post("/send-otp", auth(), OtpController.sendOtpToPhoneNumber);

// verify otp
router.post("/verify-otp", auth(), OtpController.verifyPhoneOtp);

export const phoneRoute = router;
