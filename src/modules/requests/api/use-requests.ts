import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getRequests } from "../functions/get-requests";
import { requestsKeys } from "./query-keys";
import {
  RequestFilters,
  RequestsResponse,
  RequestSort,
} from "@/shared/types/request";

export const useRequests = (
  hotelId?: string,
  filters?: RequestFilters,
  page = 1,
  limit = 10,
  sort?: RequestSort
): UseQueryResult<RequestsResponse, Error> => {
  return useQuery({
    queryKey: requestsKeys.list(hotelId, filters, page, limit, sort),
    queryFn: () => getRequests(hotelId, filters, page, limit, sort),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!hotelId, // Only run query if hotelId is provided
  });
};
