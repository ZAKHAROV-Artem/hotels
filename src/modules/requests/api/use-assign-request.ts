import {
  useMutation,
  useQueryClient,
  UseMutationResult,
} from "@tanstack/react-query";
import { assignRequest } from "../functions/assign-request";
import { requestsKeys } from "./query-keys";
import { GuestRequest } from "@/shared/types/request";

export const useAssignRequest = (): UseMutationResult<
  GuestRequest,
  Error,
  { id: string; assignedToId: string }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, assignedToId }) => assignRequest(id, assignedToId),
    onSuccess: (updatedRequest) => {
      queryClient.setQueryData(
        requestsKeys.detail(updatedRequest.id),
        updatedRequest
      );
      queryClient.invalidateQueries({ queryKey: requestsKeys.lists() });
    },
  });
};
