import { apiClient } from "@/shared/lib/api-client";
import { GuestRequest, RequestStatus } from "@/shared/types/request";

const REQUESTS_ENDPOINT = "/requests";

// Update request status
export const updateRequestStatus = async (
  id: string,
  status: RequestStatus
): Promise<GuestRequest> => {
  const response = await apiClient.patch(`${REQUESTS_ENDPOINT}/${id}/status`, {
    status,
  });
  return response.data;
};
