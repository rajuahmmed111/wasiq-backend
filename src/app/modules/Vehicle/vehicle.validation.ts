import { z } from "zod";

const createVehicleValidation = z.object({
  name: z.string().min(1, "Vehicle name is required"),
  seatCount: z.number().min(1, "Seat count must be at least 1"),
  luggage: z.number().min(0, "Luggage capacity must be non-negative"),
  basePrice: z.number().min(0, "Base price must be non-negative"),
  pricePerKm: z.number().min(0, "Price per km must be non-negative").optional(),
  image: z.array(z.string()).min(1, "At least one image is required"),
  plateNumber: z.string().optional(),
  isActive: z.boolean().default(true),
});

const updateVehicleValidation = z.object({
  name: z.string().min(1, "Vehicle name is required").optional(),
  seatCount: z.number().min(1, "Seat count must be at least 1").optional(),
  luggage: z
    .number()
    .min(0, "Luggage capacity must be non-negative")
    .optional(),
  basePrice: z.number().min(0, "Base price must be non-negative").optional(),
  pricePerKm: z.number().min(0, "Price per km must be non-negative").optional(),
  image: z.array(z.string()).optional(),
  plateNumber: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const VehicleValidation = {
  createVehicleValidation,
  updateVehicleValidation,
};
