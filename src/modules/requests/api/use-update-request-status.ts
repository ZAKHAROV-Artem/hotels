import {
  useMutation,
  useQueryClient,
  UseMutationResult,
} from "@tanstack/react-query";
import { updateRequestStatus } from "../functions/update-request-status";
import { requestsKeys } from "./query-keys";
import { GuestRequest, RequestStatus } from "@/shared/types/request";

export const useUpdateRequestStatus = (): UseMutationResult<
  GuestRequest,
  Error,
  { id: string; status: RequestStatus }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => updateRequestStatus(id, status),
    onMutate: async ({ id, status }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: requestsKeys.detail(id) });

      // Snapshot the previous value
      const previousRequest = queryClient.getQueryData<GuestRequest>(
        requestsKeys.detail(id)
      );

      // Optimistically update to the new value
      if (previousRequest) {
        queryClient.setQueryData(requestsKeys.detail(id), {
          ...previousRequest,
          status,
          updatedAt: new Date(),
        });
      }

      return { previousRequest };
    },
    onError: (err, { id }, context) => {
      // Rollback on error
      if (context?.previousRequest) {
        queryClient.setQueryData(
          requestsKeys.detail(id),
          context.previousRequest
        );
      }
    },
    onSettled: (updatedRequest) => {
      // Always refetch after error or success
      if (updatedRequest) {
        queryClient.invalidateQueries({
          queryKey: requestsKeys.detail(updatedRequest.id),
        });
        queryClient.invalidateQueries({ queryKey: requestsKeys.lists() });
        queryClient.invalidateQueries({ queryKey: requestsKeys.stats() });
      }
    },
  });
};
