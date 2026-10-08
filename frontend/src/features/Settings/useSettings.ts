import { useMutation, useQuery } from "@tanstack/react-query";

import { retryApiError } from "@/api/api-error";

import SettingsApi from "./Settings.api";

const api = new SettingsApi();

export const SettingsQueryKey = "settings";

export default function useSettings() {
  const query = useQuery({
    queryKey: [SettingsQueryKey],
    queryFn: api.getAll,
    retry: retryApiError,
  });
  const mutation = useMutation({
    mutationFn: api.updateWorkHours,
    onSuccess: () => query.refetch(),
  });
  return { query, mutation };
}
