import express from "express";
import { TripServiceController } from "./tripService.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { TripServiceValidation } from "./tripService.validation";
import validateRequest from "../../middlewares/validateRequest";
import { uploadFile } from "../../../helpars/fileUploader";
import { parseBodyData } from "../../middlewares/parseNestedJson";

const router = express.Router();

// create trip service
router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  uploadFile.upload.fields([{ name: "image", maxCount: 40 }]),
  parseBodyData,
  validateRequest(TripServiceValidation.createTripServiceValidationSchema),
  TripServiceController.createTripService,
);

// get all trip services
router.get("/", TripServiceController.getAllTripServices);

// get popular trip services
router.get("/popular", TripServiceController.getPopularTripServices);

// get single trip service
router.get("/:id", TripServiceController.getSingleTripService);

// update trip service
router.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  uploadFile.upload.fields([{ name: "image", maxCount: 40 }]),
  parseBodyData,
  validateRequest(TripServiceValidation.updateTripServiceValidationSchema),
  TripServiceController.updateTripService,
);

// delete trip service
router.delete(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.AGENT),
  TripServiceController.deleteTripService,
);

export const tripServiceRoutes = router;
