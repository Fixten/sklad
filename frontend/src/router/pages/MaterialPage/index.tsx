import { useNavigate } from "react-router";

import { isFeatureEnabled } from "@/config/features";
import PageLayout from "@/layout/PageLayout";
import pathsRouter from "@/router/paths.router";
import CommandPalette from "@ui/CommandPalette";

import MaterialCatalog from "./Catalog";

export default function MaterialPage() {
  const navigate = useNavigate();

  return (
    <PageLayout title="Материалы">
      <CommandPalette
        heading="Действия"
        emptyMessage="Ничего не нашлось"
        items={
          isFeatureEnabled("supply")
            ? [
                {
                  value: "supply",
                  label: "Сделать поставку",
                  onSelect: () => {
                    void navigate(pathsRouter.supply);
                  },
                },
              ]
            : []
        }
      />
      <MaterialCatalog />
    </PageLayout>
  );
}
