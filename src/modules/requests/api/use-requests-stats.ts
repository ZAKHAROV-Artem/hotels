import { useQuery } from "@tanstack/react-query";
import { getRequestsStats } from "../functions/get-requests-stats";
import { requestsKeys } from "./query-keys";

export const useRequestsStats = (hotelId?: string) => {
  return useQuery({
    queryKey: requestsKeys.stats(hotelId),
    queryFn: () => getRequestsStats(hotelId),
    staleTime: 1000 * 60 * 2, // 2 minutes
    enabled: !!hotelId, // Only run query if hotelId is provided
  });
};
