import {
  MutationFunction,
  QueryClient,
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect, useRef } from "react";

import { type ApiError, retryApiError } from "@/api/api-error";
import { toastError } from "@ui/Toast";

interface BaseItem {
  id: number;
  deleted_at?: string | null;
}

export function useFeatureData<T extends BaseItem>(
  queryKey: QueryKey,
  getItems: () => Promise<T[]>,
) {
  const query = useQuery({
    queryKey: queryKey,
    queryFn: getItems,
    retry: retryApiError,
  });
  const toasted = useRef<ApiError | undefined>(undefined);

  useEffect(() => {
    if (query.error && query.error !== toasted.current) {
      toasted.current = query.error;
      toastError("Не удалось загрузить данные");
    }
  }, [query.error]);

  const getAllData = () => query.data ?? [];

  return {
    query,
    getAllData,
    getActiveData: () => getAllData().filter((row) => !row.deleted_at),
    getMap: () => new Map(getAllData().map((v) => [v.id, v])),
  };
}

export function useFeatureMutation<TData, TVariables>(
  queryKey: QueryKey,
  mutationFn: MutationFunction<TData, TVariables>,
  queryClient: QueryClient,
) {
  return useMutation<TData, Error, TVariables>({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
}

interface Api<
  CData,
  CVariables,
  UData,
  UVariables,
  DData,
  DVariables,
  RData,
  RVariables,
> {
  create: MutationFunction<CData, CVariables>;
  update: MutationFunction<UData, UVariables>;
  remove: MutationFunction<DData, DVariables>;
  restore: MutationFunction<RData, RVariables>;
}

export function useApiMutations<CD, CV, UD, UV, DD, DV, RD, RV>(
  queryKey: QueryKey,
  api: Api<CD, CV, UD, UV, DD, DV, RD, RV>,
) {
  const queryClient = useQueryClient();

  return {
    addMutation: useFeatureMutation(queryKey, api.create, queryClient),
    updateMutation: useFeatureMutation(queryKey, api.update, queryClient),
    removeMutation: useFeatureMutation(queryKey, api.remove, queryClient),
    restoreMutation: useFeatureMutation(queryKey, api.restore, queryClient),
  };
}
