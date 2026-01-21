import { z } from "zod";

// create day trip validation schema
const createDayTripValidationSchema = z.object({
  from: z.string().min(1, "From location is required"),
  to: z.string().min(1, "To location is required"),
  price: z.number().positive("Price must be a positive number"),
  duration: z.string().min(1, "Duration is required"),
  groupType: z.string().min(1, "Group type is required"),
  image: z
    .array(z.string().url("Each image must be a valid URL"))
    .min(1, "At least one image is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  isPopular: z.boolean().optional().default(false),
  bookingCount: z.number().int().min(0).optional().default(0),
  features: z.any().optional(), // JSON field for features
  routeType: z.string().optional().default("city_to_city"),
  isService: z.enum(["AVAILABLE", "BOOKED"]).optional().default("AVAILABLE"),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional().default("ACTIVE"),
  ratings: z.number().min(0).max(5).optional().default(0),
  reviewCount: z.number().int().min(0).optional().default(0),
});

// update day trip validation schema
const updateDayTripValidationSchema = z.object({
  from: z.string().min(1, "From location is required").optional(),
  to: z.string().min(1, "To location is required").optional(),
  price: z.number().positive("Price must be a positive number").optional(),
  duration: z.string().min(1, "Duration is required").optional(),
  groupType: z.string().min(1, "Group type is required").optional(),
  image: z
    .array(z.string().url("Each image must be a valid URL"))
    .min(1, "At least one image is required")
    .optional(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .optional(),
  isPopular: z.boolean().optional(),
  bookingCount: z.number().int().min(0).optional(),
  features: z.any().optional(), // JSON field for features
  routeType: z.string().optional(),
  isService: z.enum(["AVAILABLE", "BOOKED"]).optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  ratings: z.number().min(0).max(5).optional(),
  reviewCount: z.number().int().min(0).optional(),
});

// query filters validation schema
const dayTripFiltersValidationSchema = z.object({
  search: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  minPrice: z
    .string()
    .transform((val) => (val ? parseFloat(val) : undefined))
    .optional(),
  maxPrice: z
    .string()
    .transform((val) => (val ? parseFloat(val) : undefined))
    .optional(),
  routeType: z.string().optional(),
  isPopular: z
    .string()
    .transform((val) => val === "true")
    .optional(),
  page: z
    .string()
    .transform((val) => parseInt(val) || 1)
    .optional(),
  limit: z
    .string()
    .transform((val) => parseInt(val) || 10)
    .optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

// params validation schema
const paramsValidationSchema = z.object({
  id: z.string().min(1, "ID is required"),
});

export const DayTripValidation = {
  createDayTripValidationSchema,
  updateDayTripValidationSchema,
  dayTripFiltersValidationSchema,
  paramsValidationSchema,
};
