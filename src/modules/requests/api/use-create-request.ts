import {
  useMutation,
  useQueryClient,
  UseMutationResult,
} from "@tanstack/react-query";
import { createRequest } from "../functions/create-request";
import { requestsKeys } from "./query-keys";
import { GuestRequest, CreateRequestDto } from "@/shared/types/request";

export const useCreateRequest = (): UseMutationResult<
  GuestRequest,
  Error,
  CreateRequestDto
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRequest,
    onSuccess: () => {
      // Invalidate and refetch requests list and stats
      queryClient.invalidateQueries({ queryKey: requestsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: requestsKeys.stats() });
    },
  });
};
