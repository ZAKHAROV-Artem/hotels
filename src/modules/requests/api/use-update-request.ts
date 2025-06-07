import {
  useMutation,
  useQueryClient,
  UseMutationResult,
} from "@tanstack/react-query";
import { updateRequest } from "../functions/update-request";
import { requestsKeys } from "./query-keys";
import { GuestRequest, UpdateRequestDto } from "@/shared/types/request";

export const useUpdateRequest = (): UseMutationResult<
  GuestRequest,
  Error,
  { id: string; data: UpdateRequestDto }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateRequest(id, data),
    onSuccess: (updatedRequest) => {
      // Update the specific request in cache
      queryClient.setQueryData(
        requestsKeys.detail(updatedRequest.id),
        updatedRequest
      );

      // Invalidate lists to refresh them
      queryClient.invalidateQueries({ queryKey: requestsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: requestsKeys.stats() });
      if (updatedRequest.roomNumber) {
        queryClient.invalidateQueries({
          queryKey: requestsKeys.byRoom(updatedRequest.roomNumber),
        });
      }
    },
  });
};
