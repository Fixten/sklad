import { useMutation, useQuery } from "@tanstack/react-query";
import SettingsApi from "./Settings.api";

const api = new SettingsApi();

export default function useSettings() {
  const query = useQuery({
    queryKey: ["settings"],
    queryFn: api.getAll,
  });
  const mutation = useMutation({
    mutationFn: api.updateWorkHours,
    onSuccess: () => query.refetch(),
  });
  return { query, mutation };
}
