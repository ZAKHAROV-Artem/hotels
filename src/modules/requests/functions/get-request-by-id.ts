import { apiClient } from "@/shared/lib/api-client";
import { GuestRequest } from "@/shared/types/request";

const REQUESTS_ENDPOINT = "/requests";

// Get a single request by ID
export const getRequestById = async (id: string): Promise<GuestRequest> => {
  const response = await apiClient.get(`${REQUESTS_ENDPOINT}/${id}`);
  return response.data;
};
