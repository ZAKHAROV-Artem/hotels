import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getRequestById } from "../functions/get-request-by-id";
import { requestsKeys } from "./query-keys";
import { GuestRequest } from "@/shared/types/request";

export const useRequest = (id: string): UseQueryResult<GuestRequest, Error> => {
  return useQuery({
    queryKey: requestsKeys.detail(id),
    queryFn: () => getRequestById(id),
    enabled: !!id,
  });
};
