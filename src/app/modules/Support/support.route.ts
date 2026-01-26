import express from "express";
import { SupportController } from "./support.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

// get all multi day tour requests
router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  SupportController.getAllSupport,
);

// create multi day tour request
router.post(
  "/",
  auth(UserRole.USER, UserRole.AGENT),
  SupportController.createSupport,
);

// get multi day tour request by id
router.get(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.USER, UserRole.AGENT),
  SupportController.getSupportById,
);

// update multi day tour request status
router.patch(
  "/update-support-status/:supportId",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  SupportController.updateSupportStatus,
);

export const supportRoutes = router;
