import { RequestFilters, RequestSort } from "@/shared/types/request";

// Query keys for requests
export const requestsKeys = {
  all: ["requests"] as const,
  lists: () => [...requestsKeys.all, "list"] as const,
  list: (
    hotelId?: string,
    filters?: RequestFilters,
    page?: number,
    limit?: number,
    sort?: RequestSort
  ) =>
    [...requestsKeys.lists(), { hotelId, filters, page, limit, sort }] as const,
  details: () => [...requestsKeys.all, "detail"] as const,
  detail: (id: string) => [...requestsKeys.details(), id] as const,
  stats: (hotelId?: string) => [...requestsKeys.all, "stats", hotelId] as const,
  byRoom: (roomNumber: string) =>
    [...requestsKeys.all, "room", roomNumber] as const,
};
