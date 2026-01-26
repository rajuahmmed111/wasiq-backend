import { Router } from "express";
import { VehicleController } from "./vehicle.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

// create vehicle (admin only)
router.post("/", auth(UserRole.ADMIN), VehicleController.createVehicle);

// get all vehicles (public)
router.get("/", VehicleController.getAllVehicles);

// get single vehicle (public)
router.get("/:id", VehicleController.getSingleVehicle);

// update vehicle (admin only)
router.patch("/:id", auth(UserRole.ADMIN), VehicleController.updateVehicle);

// delete vehicle (admin only)
router.delete("/:id", auth(UserRole.ADMIN), VehicleController.deleteVehicle);

export const VehicleRoutes = router;
