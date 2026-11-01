import { useNavigate } from "react-router";

import { isFeatureEnabled } from "@/config/features";
import pathsRouter from "@/router/paths.router";
import CommandPalette from "@ui/CommandPalette";

export default function MaterialPage() {
  const navigate = useNavigate();

  return (
    <CommandPalette
      heading="Действия"
      emptyMessage="Ничего не нашлось"
      items={
        isFeatureEnabled("supply")
          ? [
              {
                key: "supply",
                label: "Сделать поставку",
                onSelect: () => {
                  void navigate(pathsRouter.supply);
                },
              },
            ]
          : []
      }
    />
  );
}
