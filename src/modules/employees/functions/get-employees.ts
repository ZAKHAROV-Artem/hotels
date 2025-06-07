import { apiClient } from "@/shared/lib/api-client";
import { Employee } from "@/shared/types/request";

const EMPLOYEES_ENDPOINT = "/employees";

export interface GetEmployeesParams {
  hotelId: string;
  role?: string;
  isActive?: boolean;
}

// Get employees for a hotel
export const getEmployees = async (
  params: GetEmployeesParams
): Promise<Employee[]> => {
  const response = await apiClient.get(EMPLOYEES_ENDPOINT, {
    params,
  });
  return response.data;
};
