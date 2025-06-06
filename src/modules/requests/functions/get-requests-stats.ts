import { apiClient } from "@/shared/lib/api-client";

// Get requests statistics
export const getRequestsStats = async (
  hotelId?: string
): Promise<{
  pending: number;
  inProgress: number;
  done: number;
  total: number;
}> => {
  const params = hotelId ? `?hotelId=${hotelId}` : "";
  const response = await apiClient.get(`/requests/stats${params}`);
  return response.data;
};
