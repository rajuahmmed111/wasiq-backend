import { z } from "zod";

// create trip service validation schema
const createTripServiceValidationSchema = z.object({
  from: z.string().min(1, "From location is required"),
  fromLat: z.number().optional(),
  fromLng: z.number().optional(),
  to: z.string().min(1, "To location is required"),
  toLat: z.number().optional(),
  toLng: z.number().optional(),
  price: z.number().positive("Price must be a positive number"),
  travelTimeMinutes: z
    .number()
    .int()
    .positive("Travel time must be a positive integer")
    .optional(),
  distanceKm: z
    .number()
    .positive("Distance must be a positive number")
    .optional(),
  groupType: z.string().min(1, "Group type is required"),
  images: z.array(z.string().url("Each image must be a valid URL")).optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  serviceType: z
    .enum(["DAY_TRIP", "MULTI_DAY_TOUR", "PRIVATE_TRANSFER"])
    .default("DAY_TRIP"),
  routeType: z.string().optional().default("city_to_city"),
  isPopular: z.boolean().optional().default(false),
  bookingCount: z.number().int().min(0).optional().default(0),
  features: z.any().optional(), // JSON field for features
  isService: z.enum(["AVAILABLE", "BOOKED"]).optional().default("AVAILABLE"),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional().default("ACTIVE"),
  ratings: z.number().min(0).max(5).optional().default(0),
  reviewCount: z.number().int().min(0).optional().default(0),
});

// update trip service validation schema
const updateTripServiceValidationSchema = z.object({
  from: z.string().min(1, "From location is required").optional(),
  fromLat: z.number().optional(),
  fromLng: z.number().optional(),
  to: z.string().min(1, "To location is required").optional(),
  toLat: z.number().optional(),
  toLng: z.number().optional(),
  price: z.number().positive("Price must be a positive number").optional(),
  travelTimeMinutes: z
    .number()
    .int()
    .positive("Travel time must be a positive integer")
    .optional(),
  distanceKm: z
    .number()
    .positive("Distance must be a positive number")
    .optional(),
  groupType: z.string().min(1, "Group type is required").optional(),
  images: z.array(z.string().url("Each image must be a valid URL")).optional(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .optional(),
  serviceType: z
    .enum(["DAY_TRIP", "MULTI_DAY_TOUR", "PRIVATE_TRANSFER"])
    .optional(),
  routeType: z.string().optional(),
  isPopular: z.boolean().optional(),
  bookingCount: z.number().int().min(0).optional(),
  features: z.any().optional(), // JSON field for features
  isService: z.enum(["AVAILABLE", "BOOKED"]).optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  ratings: z.number().min(0).max(5).optional(),
  reviewCount: z.number().int().min(0).optional(),
});

export const TripServiceValidation = {
  createTripServiceValidationSchema,
  updateTripServiceValidationSchema,
};
