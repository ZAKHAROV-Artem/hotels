import { apiClient } from "@/shared/lib/api-client";
import { GuestRequest, CreateRequestDto } from "@/shared/types/request";

const REQUESTS_ENDPOINT = "/requests";

// Create a new request
export const createRequest = async (
  data: CreateRequestDto
): Promise<GuestRequest> => {
  const response = await apiClient.post(REQUESTS_ENDPOINT, data);
  return response.data;
};
