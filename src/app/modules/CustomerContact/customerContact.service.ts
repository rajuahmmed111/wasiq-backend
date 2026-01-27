import { Prisma, CustomerContact } from "@prisma/client";
import prisma from "../../../shared/prisma";
import {
  ICustomerContact,
  ICustomerContactFilters,
} from "./customerContact.interface";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { paginationHelpers } from "../../../helpars/paginationHelper";
import { IGenericResponse } from "../../../interfaces/common";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";
import emailSender from "../../../helpars/emailSender";

// create customer contact
const createCustomerContact = async (
  payload: ICustomerContact,
): Promise<CustomerContact> => {
  const result = await prisma.customerContact.create({
    data: payload,
  });

  // send confirmation email to customer
  const emailSubject =
    "Thank you for contacting us - We've received your message";
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #333; text-align: center;">Thank You for Contacting Us!</h2>
      <p style="color: #666; line-height: 1.6;">
        Dear ${payload.fullName},
      </p>
      <p style="color: #666; line-height: 1.6;">
        We have successfully received your message regarding "<strong>${payload.subject}</strong>". 
        Our team will review your inquiry and get back to you as soon as possible.
      </p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="color: #333; margin-top: 0;">Your Contact Details:</h3>
        <p style="color: #666; margin: 5px 0;"><strong>Name:</strong> ${payload.fullName}</p>
        <p style="color: #666; margin: 5px 0;"><strong>Email:</strong> ${payload.email}</p>
        <p style="color: #666; margin: 5px 0;"><strong>Phone:</strong> ${payload.contactNumber}</p>
        <p style="color: #666; margin: 5px 0;"><strong>Subject:</strong> ${payload.subject}</p>
        ${payload.description ? `<p style="color: #666; margin: 5px 0;"><strong>Message:</strong> ${payload.description}</p>` : ""}
      </div>
      <p style="color: #666; line-height: 1.6;">
        We typically respond within 24-48 hours during business days. If your matter is urgent, 
        please don't hesitate to call us directly.
      </p>
      <p style="color: #666; line-height: 1.6;">
        Best regards,<br>
        The Customer Support Team
      </p>
      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="color: #999; font-size: 12px;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
    </div>
  `;

  try {
    await emailSender(emailSubject, payload.email, emailHtml);
  } catch (error) {
    console.error("Failed to send confirmation email:", error);
    // don't throw error here, as the contact was created successfully
  }

  return result;
};

// get all customer contacts
const getAllCustomerContacts = async (
  filters: ICustomerContactFilters,
  options: IPaginationOptions,
): Promise<IGenericResponse<CustomerContact[]>> => {
  const { page, limit, skip } = paginationHelpers.calculatedPagination(options);

  const { search, minDate, maxDate } = filters;

  const andConditions: Prisma.CustomerContactWhereInput[] = [];

  // search by fullName, email, contactNumber, subject
  if (search) {
    andConditions.push({
      OR: [
        {
          fullName: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          contactNumber: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          subject: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  // filter by date range
  if (minDate || maxDate) {
    const dateFilter: Prisma.DateTimeFilter = {};
    if (minDate) dateFilter.gte = new Date(minDate);
    if (maxDate) dateFilter.lte = new Date(maxDate);
    andConditions.push({ createdAt: dateFilter });
  }

  const whereCondition: Prisma.CustomerContactWhereInput = {
    AND: andConditions,
  };

  const result = await prisma.customerContact.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: "desc" },
  });

  const total = await prisma.customerContact.count({
    where: whereCondition,
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

// get single customer contact
const getSingleCustomerContact = async (
  id: string,
): Promise<CustomerContact | null> => {
  const result = await prisma.customerContact.findUnique({
    where: {
      id,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Customer contact not found");
  }

  return result;
};

// update customer contact
const updateCustomerContact = async (
  id: string,
  payload: Partial<ICustomerContact>,
): Promise<CustomerContact> => {
  // check if customer contact exists
  const existingCustomerContact = await prisma.customerContact.findUnique({
    where: { id },
  });

  if (!existingCustomerContact) {
    throw new ApiError(httpStatus.NOT_FOUND, "Customer contact not found");
  }

  const result = await prisma.customerContact.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

// delete customer contact
const deleteCustomerContact = async (id: string): Promise<CustomerContact> => {
  // check if customer contact exists
  const existingCustomerContact = await prisma.customerContact.findUnique({
    where: { id },
  });

  if (!existingCustomerContact) {
    throw new ApiError(httpStatus.NOT_FOUND, "Customer contact not found");
  }

  const result = await prisma.customerContact.delete({
    where: {
      id,
    },
  });

  return result;
};

export const CustomerContactService = {
  createCustomerContact,
  getAllCustomerContacts,
  getSingleCustomerContact,
  updateCustomerContact,
  deleteCustomerContact,
};
