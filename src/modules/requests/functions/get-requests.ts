import { apiClient } from "@/shared/lib/api-client";
import {
  RequestFilters,
  RequestsResponse,
  RequestSort,
} from "@/shared/types/request";

const REQUESTS_ENDPOINT = "/requests";

// Get all requests with optional filters and pagination
export const getRequests = async (
  hotelId?: string,
  filters?: RequestFilters,
  page = 1,
  limit = 10,
  sort?: RequestSort
): Promise<RequestsResponse> => {
  const params = new URLSearchParams();

  if (hotelId) {
    params.append("hotelId", hotelId);
  }

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
  }

  if (sort) {
    params.append("sortBy", sort.sortBy);
    params.append("sortOrder", sort.sortOrder);
  }

  params.append("page", page.toString());
  params.append("limit", limit.toString());

  const response = await apiClient.get(`${REQUESTS_ENDPOINT}?${params}`);
  return response.data;
};
