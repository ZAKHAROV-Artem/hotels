import { apiClient } from "@/shared/lib/api-client";
import { GuestRequest, UpdateRequestDto } from "@/shared/types/request";

const REQUESTS_ENDPOINT = "/requests";

// Update an existing request
export const updateRequest = async (
  id: string,
  data: UpdateRequestDto
): Promise<GuestRequest> => {
  const response = await apiClient.patch(`${REQUESTS_ENDPOINT}/${id}`, data);
  return response.data;
};
