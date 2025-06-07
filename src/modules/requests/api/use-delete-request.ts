import {
  useMutation,
  useQueryClient,
  UseMutationResult,
} from "@tanstack/react-query";
import { deleteRequest } from "../functions/delete-request";
import { requestsKeys } from "./query-keys";

export const useDeleteRequest = (): UseMutationResult<void, Error, string> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRequest,
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: requestsKeys.detail(deletedId) });

      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: requestsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: requestsKeys.stats() });
    },
  });
};
