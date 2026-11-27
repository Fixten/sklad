import { useSearchParams } from "react-router";

import PageLayout from "@/layout/PageLayout";
import CardGrid from "@/router/pages/MaterialPage/Catalog/CardList/CardGrid";
import SearchField from "@/router/pages/MaterialPage/Catalog/SearchField";
import pathsRouter from "@/router/paths.router";

import SuppliesEmpty from "./SuppliesEmpty";
import SupplyCard from "./SupplyCard";
import useSuppliesView from "./useSuppliesView";
import VariantSummary from "./VariantSummary";

export default function SuppliesPage() {
  const [searchParams] = useSearchParams();
  const view = useSuppliesView(searchParams.get("variant"));

  return (
    <PageLayout
      back={{ to: pathsRouter.material, label: "Материалы" }}
      title={view.variant ? `Поставки — ${view.variant.name}` : "Поставки"}
    >
      {view.variant && !view.loading ? (
        <VariantSummary variant={view.variant} stock={view.stock} />
      ) : null}
      <SearchField value={view.query} onChange={view.setQuery} />
      <CardGrid
        loading={view.loading}
        count={view.items.length}
        empty={<SuppliesEmpty createTo={view.createTo} />}
      >
        {view.items.map((item) => (
          <SupplyCard
            key={item.supply.id}
            supply={item.supply}
            context={item.context}
          />
        ))}
      </CardGrid>
    </PageLayout>
  );
}
