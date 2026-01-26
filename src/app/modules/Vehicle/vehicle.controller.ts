import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { VehicleService } from "./vehicle.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { IVehicleFilters } from "./vehicle.interface";
import { pick } from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination";
import { VehicleValidation } from "./vehicle.validation";

// create vehicle
const createVehicle = catchAsync(async (req: Request, res: Response) => {
  const vehicleData = req.body;

  const result = await VehicleService.createVehicle(vehicleData);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Vehicle created successfully",
    data: result,
  });
});

// get all vehicles
const getAllVehicles = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, [
    "search",
    "minSeatCount",
    "maxSeatCount",
    "minBasePrice",
    "maxBasePrice",
    "isActive",
  ]);
  const options = pick(req.query, paginationFields);

  const result = await VehicleService.getAllVehicles(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Vehicles retrieved successfully",
    data: result,
  });
});

// get single vehicle
const getSingleVehicle = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await VehicleService.getSingleVehicle(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Vehicle retrieved successfully",
    data: result,
  });
});

// update vehicle
const updateVehicle = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const vehicleData = req.body;

  const result = await VehicleService.updateVehicle(id, vehicleData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Vehicle updated successfully",
    data: result,
  });
});

// delete vehicle
const deleteVehicle = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await VehicleService.deleteVehicle(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Vehicle deleted successfully",
    data: result,
  });
});

export const VehicleController = {
  createVehicle,
  getAllVehicles,
  getSingleVehicle,
  updateVehicle,
  deleteVehicle,
};
