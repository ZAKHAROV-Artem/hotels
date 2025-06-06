import { apiClient } from "@/shared/lib/api-client";
import { GuestRequest } from "@/shared/types/request";

const REQUESTS_ENDPOINT = "/requests";

// Get requests by room number
export const getRequestsByRoom = async (
  roomNumber: string
): Promise<GuestRequest[]> => {
  const response = await apiClient.get(
    `${REQUESTS_ENDPOINT}/room/${roomNumber}`
  );
  return response.data;
};
