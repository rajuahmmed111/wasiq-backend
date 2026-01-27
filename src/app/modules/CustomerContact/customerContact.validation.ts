import { z } from "zod";

const createCustomerContactValidation = z.object({
  body: z.object({
    fullName: z.string().min(1, "Full name is required"),
    email: z.string().email("Invalid email format"),
    contactNumber: z.string().min(1, "Contact number is required"),
    subject: z.string().min(1, "Subject is required"),
    description: z.string().optional(),
  }),
});

const updateCustomerContactValidation = z.object({
  body: z.object({
    fullName: z.string().min(1, "Full name is required").optional(),
    email: z.string().email("Invalid email format").optional(),
    contactNumber: z.string().min(1, "Contact number is required").optional(),
    subject: z.string().min(1, "Subject is required").optional(),
    description: z.string().optional(),
  }),
});

export const CustomerContactValidation = {
  createCustomerContactValidation,
  updateCustomerContactValidation,
};
