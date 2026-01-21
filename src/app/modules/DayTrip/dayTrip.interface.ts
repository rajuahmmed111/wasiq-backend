import { DayTrip as PrismaDayTrip } from "@prisma/client";

export type IDayTrip = Omit<PrismaDayTrip, "id" | "createdAt" | "updatedAt"> & {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type IDayTripFilters = {
  search?: string;
  from?: string;
  to?: string;
  minPrice?: number;
  maxPrice?: number;
  routeType?: string;
  isPopular?: boolean;
};

export type IDayTripResponse = {
  data: IDayTrip[];
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
};
