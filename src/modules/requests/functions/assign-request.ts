import { apiClient } from "@/shared/lib/api-client";
import { GuestRequest } from "@/shared/types/request";

const REQUESTS_ENDPOINT = "/requests";

// Assign request to staff member
export const assignRequest = async (
  id: string,
  assignedToId: string
): Promise<GuestRequest> => {
  const response = await apiClient.patch(`${REQUESTS_ENDPOINT}/${id}/assign`, {
    assignedToId,
  });
  return response.data;
};
