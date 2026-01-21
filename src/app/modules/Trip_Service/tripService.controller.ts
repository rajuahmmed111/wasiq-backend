import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { TripServiceService } from "./tripService.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { ITripService } from "./tripService.interface";
import { uploadFile } from "../../../helpars/fileUploader";

// create trip service
const createTripService = catchAsync(async (req: Request, res: Response) => {
  const files = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };

  const userId = req.user?.id;
  const tripServiceData = req.body;

  // handle image uploads
  let imageUrls: string[] = [];
  if (files?.image && files.image.length > 0) {
    const uploadPromises = files.image.map((file) =>
      uploadFile.uploadToCloudinary(file),
    );
    const uploadResults = await Promise.all(uploadPromises);
    imageUrls = uploadResults
      .filter(
        (result): result is NonNullable<typeof result> => result !== undefined,
      )
      .map((result) => result.secure_url);
  }

  // image with tripServiceData
  const finalTripServiceData = {
    ...tripServiceData,
    images: imageUrls.length > 0 ? imageUrls : [],
  };

  const result = await TripServiceService.createTripService(
    userId,
    finalTripServiceData,
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Trip service created successfully",
    data: result,
  });
});

// get all trip services
const getAllTripServices = catchAsync(async (req: Request, res: Response) => {
  const filters = req.query;
  const options = {
    page: parseInt(req.query.page as string) || 1,
    limit: parseInt(req.query.limit as string) || 10,
    sortBy: req.query.sortBy as string,
    sortOrder: req.query.sortOrder as "asc" | "desc",
  };

  const result = await TripServiceService.getAllTripServices(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Trip services retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

// get single trip service
const getSingleTripService = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await TripServiceService.getSingleTripService(id);

  sendResponse<ITripService>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Trip service retrieved successfully",
    data: result,
  });
});

// update trip service
const updateTripService = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;
  const updateData = req.body;

  const files = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };

  // Handle image uploads to Cloudinary for updates
  let imageUrls: string[] = [];
  if (files?.image && files.image.length > 0) {
    const uploadPromises = files.image.map((file) =>
      uploadFile.uploadToCloudinary(file),
    );
    const uploadResults = await Promise.all(uploadPromises);
    imageUrls = uploadResults
      .filter(
        (result): result is NonNullable<typeof result> => result !== undefined,
      )
      .map((result) => result.secure_url);
  }

  // Add image URLs to updateData if new images were uploaded
  const finalUpdateData = {
    ...updateData,
    ...(imageUrls.length > 0 && { images: imageUrls }),
  };

  const result = await TripServiceService.updateTripService(
    id,
    userId,
    finalUpdateData,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Trip service updated successfully",
    data: result,
  });
});

// delete trip service
const deleteTripService = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  const result = await TripServiceService.deleteTripService(id, userId);

  sendResponse<ITripService>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Trip service deleted successfully",
    data: result,
  });
});

// get popular trip services
const getPopularTripServices = catchAsync(
  async (req: Request, res: Response) => {
    const result = await TripServiceService.getPopularTripServices();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Popular trip services retrieved successfully",
      data: result,
    });
  },
);

export const TripServiceController = {
  createTripService,
  getAllTripServices,
  getSingleTripService,
  updateTripService,
  deleteTripService,
  getPopularTripServices,
};
