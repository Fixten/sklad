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
        items={[
          ...(isFeatureEnabled("supply")
            ? [
                {
                  value: "supply",
                  label: "Сделать поставку",
                  onSelect: () => {
                    void navigate(pathsRouter.supply);
                  },
                },
                {
                  value: "supplies",
                  label: "Поставки",
                  onSelect: () => {
                    void navigate(pathsRouter.supplies);
                  },
                },
              ]
            : []),
          {
            value: "material-new",
            label: "Добавить материал",
            onSelect: () => {
              void navigate(pathsRouter.materialItemNew);
            },
          },
          {
            value: "type-new",
            label: "Добавить тип",
            onSelect: () => {
              void navigate(pathsRouter.materialTypeNew);
            },
          },
          {
            value: "variant-new",
            label: "Добавить вариант",
            onSelect: () => {
              void navigate(pathsRouter.materialVariantNew);
            },
          },
          ...(isFeatureEnabled("supplier")
            ? [
                {
                  value: "suppliers",
                  label: "Поставщики",
                  onSelect: () => {
                    void navigate(pathsRouter.suppliers);
                  },
                },
              ]
            : []),
        ]}
      />
      <MaterialCatalog />
    </PageLayout>
  );
}
