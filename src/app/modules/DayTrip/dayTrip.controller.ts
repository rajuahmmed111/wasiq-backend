import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { DayTripService } from "./dayTrip.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { IDayTrip } from "./dayTrip.interface";

// create day trip
const createDayTrip = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const dayTripData = req.body;

  const result = await DayTripService.createDayTrip(userId, dayTripData);

  sendResponse<IDayTrip>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Day trip created successfully",
    data: result,
  });
});

// get all day trips
const getAllDayTrips = catchAsync(async (req: Request, res: Response) => {
  const filters = req.query;
  const options = {
    page: parseInt(req.query.page as string) || 1,
    limit: parseInt(req.query.limit as string) || 10,
    sortBy: req.query.sortBy as string,
    sortOrder: req.query.sortOrder as "asc" | "desc",
  };

  const result = await DayTripService.getAllDayTrips(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Day trips retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

// get single day trip
const getSingleDayTrip = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await DayTripService.getSingleDayTrip(id);

  sendResponse<IDayTrip>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Day trip retrieved successfully",
    data: result,
  });
});

// update day trip
const updateDayTrip = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;
  const updateData = req.body;

  const result = await DayTripService.updateDayTrip(id, userId, updateData);

  sendResponse<IDayTrip>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Day trip updated successfully",
    data: result,
  });
});

// delete day trip
const deleteDayTrip = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  const result = await DayTripService.deleteDayTrip(id, userId);

  sendResponse<IDayTrip>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Day trip deleted successfully",
    data: result,
  });
});

// get popular day trips
const getPopularDayTrips = catchAsync(async (req: Request, res: Response) => {
  const result = await DayTripService.getPopularDayTrips();

  sendResponse<IDayTrip[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Popular day trips retrieved successfully",
    data: result,
  });
});

export const DayTripController = {
  createDayTrip,
  getAllDayTrips,
  getSingleDayTrip,
  updateDayTrip,
  deleteDayTrip,
  getPopularDayTrips,
};
