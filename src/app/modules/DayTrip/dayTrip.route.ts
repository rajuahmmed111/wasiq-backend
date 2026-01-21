import express from "express";
import { DayTripController } from "./dayTrip.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { DayTripValidation } from "./dayTrip.validation";
import validateRequest from "../../middlewares/validateRequest";

const router = express.Router();

// create day trip
router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.AGENT),
  validateRequest(DayTripValidation.createDayTripValidationSchema),
  DayTripController.createDayTrip,
);

// get all day trips
router.get("/", DayTripController.getAllDayTrips);

// get popular day trips
router.get("/popular", DayTripController.getPopularDayTrips);

// get single day trip
router.get("/:id", DayTripController.getSingleDayTrip);

// update day trip
router.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.AGENT),
  validateRequest(DayTripValidation.updateDayTripValidationSchema),
  DayTripController.updateDayTrip,
);

// delete day trip
router.delete(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.AGENT),
  validateRequest(DayTripValidation.paramsValidationSchema),
  DayTripController.deleteDayTrip,
);

export const dayTripRoutes = router;
