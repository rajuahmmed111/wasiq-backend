import { Prisma, TripService } from "@prisma/client";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";
import { ITripService, ITripServiceFilters } from "./tripService.interface";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { paginationHelpers } from "../../../helpars/paginationHelper";

// create trip service
const createTripService = async (
  userId: string,
  payload: ITripService,
): Promise<TripService> => {
  // check if user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const result = await prisma.tripService.create({
    data: {
      ...payload,
      userId: user.id,
    },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
    },
  });

  return result;
};

// get all trip services
const getAllTripServices = async (
  filters: ITripServiceFilters,
  options: IPaginationOptions,
): Promise<{ data: TripService[]; meta: any }> => {
  const { page, limit, skip } = paginationHelpers.calculatedPagination(options);
  const { search, from, to, minPrice, maxPrice, routeType, isPopular } =
    filters;

  const andConditions: Prisma.TripServiceWhereInput[] = [];

  // search condition
  if (search) {
    andConditions.push({
      OR: [
        { from: { contains: search, mode: "insensitive" } },
        { to: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ],
    });
  }

  // from filter
  if (from) {
    andConditions.push({ from: { contains: from, mode: "insensitive" } });
  }

  // to filter
  if (to) {
    andConditions.push({ to: { contains: to, mode: "insensitive" } });
  }

  // price range filter
  if (minPrice !== undefined || maxPrice !== undefined) {
    const priceFilter: any = {};
    if (minPrice !== undefined) priceFilter.gte = minPrice;
    if (maxPrice !== undefined) priceFilter.lte = maxPrice;
    andConditions.push({ price: priceFilter });
  }

  // route type filter
  if (routeType) {
    andConditions.push({ routeType: routeType });
  }

  // popular filter
  if (isPopular !== undefined) {
    andConditions.push({ isPopular: isPopular });
  }

  const whereConditions: Prisma.TripServiceWhereInput = {
    AND: andConditions,
  };

  const result = await prisma.tripService.findMany({
    where: whereConditions,
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
    },
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: "desc" },
  });

  const total = await prisma.tripService.count({
    where: whereConditions,
  });

  const meta = {
    total,
    page,
    limit,
  };

  return {
    data: result,
    meta,
  };
};

// get single trip service
const getSingleTripService = async (id: string): Promise<TripService> => {
  const result = await prisma.tripService.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Trip service not found");
  }

  return result;
};

// update trip service
const updateTripService = async (
  id: string,
  userId: string,
  payload: Partial<ITripService>,
): Promise<TripService> => {
  // check if trip service exists and belongs to user
  const existingTripService = await prisma.tripService.findFirst({
    where: { id, userId },
  });

  if (!existingTripService) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Trip service not found or you don't have permission",
    );
  }

  const result = await prisma.tripService.update({
    where: { id },
    data: payload,
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
    },
  });

  return result;
};

// delete trip service
const deleteTripService = async (
  id: string,
  userId: string,
): Promise<TripService> => {
  // check if trip service exists and belongs to user
  const existingTripService = await prisma.tripService.findFirst({
    where: { id, userId },
  });

  if (!existingTripService) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Trip service not found or you don't have permission",
    );
  }

  const result = await prisma.tripService.delete({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
    },
  });

  return result;
};

// get popular trip services
const getPopularTripServices = async (): Promise<TripService[]> => {
  const result = await prisma.tripService.findMany({
    where: {
      isPopular: true,
      isService: "AVAILABLE",
      status: "ACTIVE",
    },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
    },
    orderBy: {
      bookingCount: "desc",
    },
    take: 10, // limit to top 10 popular trips
  });

  return result;
};

export const TripServiceService = {
  createTripService,
  getAllTripServices,
  getSingleTripService,
  updateTripService,
  deleteTripService,
  getPopularTripServices,
};
