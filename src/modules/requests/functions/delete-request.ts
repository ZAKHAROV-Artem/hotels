import { apiClient } from "@/shared/lib/api-client";

const REQUESTS_ENDPOINT = "/requests";

// Delete a request
export const deleteRequest = async (id: string): Promise<void> => {
  await apiClient.delete(`${REQUESTS_ENDPOINT}/${id}`);
};
