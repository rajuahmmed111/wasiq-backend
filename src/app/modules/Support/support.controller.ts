import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { SupportService } from "./support.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { pick } from "../../../shared/pick";
import { filterField } from "./support.constant";
import { paginationFields } from "../../../constants/pagination";

// create multi day tour request
const createSupport = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const data = req.body;
  const result = await SupportService.createSupport(userId, data);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Multi Day Tour request submitted successfully",
    data: result,
  });
});

// get all multi day tour requests
const getAllSupport = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, filterField);
  const options = pick(req.query, paginationFields);
  const result = await SupportService.getAllSupport(filter, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Multi Day Tour requests fetched successfully",
    data: result,
  });
});

// get multi day tour request by id
const getSupportById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await SupportService.getSupportById(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Multi Day Tour request fetched successfully",
    data: result,
  });
});

// update multi day tour request status
const updateSupportStatus = catchAsync(async (req: Request, res: Response) => {
  const supportId = req.params.supportId;
  const result = await SupportService.updateSupportStatus(supportId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Multi Day Tour request status updated successfully",
    data: result,
  });
});

export const SupportController = {
  createSupport,
  getAllSupport,
  getSupportById,
  updateSupportStatus,
};
