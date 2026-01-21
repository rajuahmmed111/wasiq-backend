import { DayTrip, Prisma } from "@prisma/client";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";
import { IDayTrip, IDayTripFilters } from "./dayTrip.interface";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { paginationHelpers } from "../../../helpars/paginationHelper";

// create day trip
const createDayTrip = async (
  userId: string,
  payload: IDayTrip,
): Promise<DayTrip> => {
  // check if user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const result = await prisma.dayTrip.create({
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

// get all day trips
const getAllDayTrips = async (
  filters: IDayTripFilters,
  options: IPaginationOptions,
): Promise<{ data: DayTrip[]; meta: any }> => {
  const { page, limit, skip } = paginationHelpers.calculatedPagination(options);
  const { search, from, to, minPrice, maxPrice, routeType, isPopular } =
    filters;

  const andConditions: Prisma.DayTripWhereInput[] = [];

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

  const whereConditions: Prisma.DayTripWhereInput = {
    AND: andConditions,
  };

  const result = await prisma.dayTrip.findMany({
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

  const total = await prisma.dayTrip.count({
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

// get single day trip
const getSingleDayTrip = async (id: string): Promise<DayTrip> => {
  const result = await prisma.dayTrip.findUnique({
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
    throw new ApiError(httpStatus.NOT_FOUND, "Day trip not found");
  }

  return result;
};

// update day trip
const updateDayTrip = async (
  id: string,
  userId: string,
  payload: Partial<IDayTrip>,
): Promise<DayTrip> => {
  // check if day trip exists and belongs to user
  const existingDayTrip = await prisma.dayTrip.findFirst({
    where: { id, userId },
  });

  if (!existingDayTrip) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Day trip not found or you don't have permission",
    );
  }

  const result = await prisma.dayTrip.update({
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

// delete day trip
const deleteDayTrip = async (id: string, userId: string): Promise<DayTrip> => {
  // check if day trip exists and belongs to user
  const existingDayTrip = await prisma.dayTrip.findFirst({
    where: { id, userId },
  });

  if (!existingDayTrip) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Day trip not found or you don't have permission",
    );
  }

  const result = await prisma.dayTrip.delete({
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

// get popular day trips
const getPopularDayTrips = async (): Promise<DayTrip[]> => {
  const result = await prisma.dayTrip.findMany({
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

export const DayTripService = {
  createDayTrip,
  getAllDayTrips,
  getSingleDayTrip,
  updateDayTrip,
  deleteDayTrip,
  getPopularDayTrips,
};
