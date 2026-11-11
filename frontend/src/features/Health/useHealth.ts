import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

import type { ApiError } from "@/api/api-error";
import { toastError } from "@ui/Toast";

import HealthApi from "./Health.api";

const api = new HealthApi();

export const HealthQueryKey = "health";

export default function useHealth() {
  const query = useQuery({
    queryKey: [HealthQueryKey],
    queryFn: api.check,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const toasted = useRef<ApiError | undefined>(undefined);
  useEffect(() => {
    if (query.error && query.error !== toasted.current) {
      toasted.current = query.error;
      toastError(
        "Сервер недоступен",
        "Не удалось подключиться к бэкенду. Проверьте, что он запущен.",
      );
    }
  }, [query.error]);

  return query;
}
