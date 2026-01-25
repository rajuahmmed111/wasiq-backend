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

// get all trip services BY_THE_HOUR
router.get("/by-the-hour", TripServiceController.getByTheHourTripServices);

// get all trip services BY_THE_HOUR and isPopular
router.get(
  "/by-the-hour/popular",
  TripServiceController.getByTheHourPopularTripServices,
);

// get all trip services DAY_TRIP
router.get("/day-trip", TripServiceController.getDayTripTripServices);

// get all trip services DAY_TRIP and isPopular
router.get(
  "/day-trip/popular",
  TripServiceController.getDayTripPopularTripServices,
);

// get all trip services MULTI_DAY_TOUR
router.get(
  "/multi-day-tour",
  TripServiceController.getMultiDayTourTripServices,
);

// get all trip services MULTI_DAY_TOUR and isPopular
router.get(
  "/multi-day-tour/popular",
  TripServiceController.getMultiDayTourPopularTripServices,
);

// get all trip services PRIVATE_TRANSFER
router.get(
  "/private-transfer",
  TripServiceController.getPrivateTransferTripServices,
);

// get all trip services PRIVATE_TRANSFER and isPopular
router.get(
  "/private-transfer/popular",
  TripServiceController.getPrivateTransferPopularTripServices,
);

// get all trip services AIRPORT_TRANSFER
router.get(
  "/airport-transfer",
  TripServiceController.getAirportTransferTripServices,
);

// get all trip services AIRPORT_TRANSFER and isPopular
router.get(
  "/airport-transfer/popular",
  TripServiceController.getAirportTransferPopularTripServices,
);

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
