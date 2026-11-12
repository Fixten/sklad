import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { retryApiError } from "@/api/api-error";

type EntityQuery = object;

interface EntityApi<TRow extends { deleted_at?: string | null }, TPatch> {
  getAll: (params?: EntityQuery) => Promise<TRow[]>;
  update: (patch: TPatch, id: number) => Promise<unknown>;
  remove: (id: number) => Promise<unknown>;
  restore: (id: number) => Promise<unknown>;
}

type UpdateInput<TPatch> = TPatch & { id: number };

interface EntityConfig<
  TRow extends { deleted_at?: string | null },
  TCreate,
  TCreateResult,
  TPatch,
> {
  queryKey: string;
  api: EntityApi<TRow, TPatch>;
  create: (input: TCreate) => Promise<TCreateResult>;
  invalidate?: string[];
  toPatch?: (value: UpdateInput<TPatch>) => TPatch;
}

export function createEntityHook<
  TRow extends { deleted_at?: string | null },
  TCreate,
  TCreateResult,
  TPatch,
>(config: EntityConfig<TRow, TCreate, TCreateResult, TPatch>) {
  function useEntity() {
    const queryClient = useQueryClient();

    const query = useQuery({
      queryKey: [config.queryKey],
      queryFn: () => config.api.getAll({ hidden: "true" }),
      retry: retryApiError,
    });

    const invalidateKeys = config.invalidate
      ? [config.queryKey, ...config.invalidate]
      : undefined;

    const invalidate = invalidateKeys
      ? () => {
          for (const key of invalidateKeys) {
            void queryClient.invalidateQueries({ queryKey: [key] });
          }
        }
      : () => query.refetch();

    const addMutation = useMutation({
      mutationFn: config.create,
      onSuccess: invalidate,
    });
    const updateMutation = useMutation({
      mutationFn: (value: UpdateInput<TPatch>) => {
        if (config.toPatch)
          return config.api.update(config.toPatch(value), value.id);

        const { id, ...patch } = value;

        // rest-minus-id of TPatch & { id } is structurally TPatch; TS can't prove it for an unconstrained generic
        return config.api.update(patch as TPatch, id);
      },
      onSuccess: invalidate,
    });
    const removeMutation = useMutation({
      mutationFn: config.api.remove,
      onSuccess: invalidate,
    });
    const restoreMutation = useMutation({
      mutationFn: config.api.restore,
      onSuccess: invalidate,
    });
    const rows = query.data ?? [];
    const activeRows = rows.filter((row) => !row.deleted_at);

    return {
      query,
      rows,
      activeRows,
      addMutation,
      updateMutation,
      removeMutation,
      restoreMutation,
    };
  }

  return useEntity;
}
