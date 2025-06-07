import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getEmployees, GetEmployeesParams } from "../functions/get-employees";
import { Employee } from "@/shared/types/request";

export const employeesKeys = {
  all: ["employees"] as const,
  byHotel: (hotelId: string) => [...employeesKeys.all, hotelId] as const,
  byRole: (hotelId: string, role?: string) =>
    [...employeesKeys.byHotel(hotelId), role] as const,
};

export const useEmployees = (
  params: GetEmployeesParams
): UseQueryResult<Employee[], Error> => {
  return useQuery({
    queryKey: employeesKeys.byRole(params.hotelId, params.role),
    queryFn: () => getEmployees(params),
    enabled: !!params.hotelId,
  });
};
