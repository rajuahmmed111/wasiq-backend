import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";
import { Prisma, SupportStatus } from "@prisma/client";
import { IFilterRequest } from "./support.interface";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { paginationHelpers } from "../../../helpars/paginationHelper";
import { searchableFields } from "./support.constant";

// create multi day tour request
const createSupport = async (userId: string, data: any) => {
  const { fullName, email, contactNumber, subject, description, supportType } =
    data;

  const support = await prisma.support.create({
    data: {
      fullName,
      email,
      contactNumber,
      subject,
      description,
    },
  });

  // create notification
  await prisma.notifications.create({
    data: {
      title: "Multi Day Tour Request",
      body: `A new multi day tour request has been received from ${support.fullName}`,
      message: `Subject: ${support.subject}`,
    },
  });

  return support;
};

// get all multi day tour requests
const getAllSupport = async (
  params: IFilterRequest,
  options: IPaginationOptions,
) => {
  const { limit, page, skip } = paginationHelpers.calculatedPagination(options);

  const { searchTerm, ...filterData } = params;

  const filters: Prisma.SupportWhereInput[] = [];

  // text search
  if (params?.searchTerm) {
    filters.push({
      OR: searchableFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  // Exact search filter
  if (Object.keys(filterData).length > 0) {
    filters.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  // always get only Pending status
  filters.push({
    status: SupportStatus.Pending,
  });

  const where: Prisma.SupportWhereInput = {
    AND: filters,
  };

  const result = await prisma.support.findMany({
    where,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
  });

  const total = await prisma.support.count({
    where,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

// get multi day tour request by id
const getSupportById = async (id: string) => {
  const result = await prisma.support.findUnique({ where: { id } });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Support not found");
  }

  return result;
};

// update multi day tour request status
const updateSupportStatus = async (supportId: string) => {
  const result = await prisma.support.update({
    where: { id: supportId },
    data: { status: SupportStatus.Closed },
  });
  return result;
};

export const SupportService = {
  createSupport,
  getAllSupport,
  getSupportById,
  updateSupportStatus,
};
