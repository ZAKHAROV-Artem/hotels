import { useQuery } from "@tanstack/react-query";
import { getRequestsByRoom } from "../functions/get-requests-by-room";
import { requestsKeys } from "./query-keys";

export const useRequestsByRoom = (roomNumber: string) => {
  return useQuery({
    queryKey: requestsKeys.byRoom(roomNumber),
    queryFn: () => getRequestsByRoom(roomNumber),
    enabled: !!roomNumber,
  });
};
