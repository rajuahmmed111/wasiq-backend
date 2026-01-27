import express from "express";
import { SettingController } from "./setting.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { settingValidation } from "./setting.validation";

const router = express.Router();

// get about App
router.get("/about", auth(), SettingController.getAbout);

//  create app about
router.post(
  "/about",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  SettingController.createOrUpdateAbout,
);

// updateNotificationSettings only for admin
router.patch(
  "/notification-settings",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  SettingController.updateNotificationSettings,
);
export const settingRoute = router;
