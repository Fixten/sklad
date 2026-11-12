import { useState } from "react";

import useMaterial from "@/features/Material/useMaterial";
import useMaterialType from "@/features/MaterialType/useMaterialType";
import useVariantsCatalog from "@/features/Variant/useVariantsCatalog";

import { buildCards, type CatalogCardData } from "./buildCards";
import CardList from "./CardList";
import { type CatalogLevel } from "./levels";
import LevelSwitcher from "./LevelSwitcher";
import SearchField from "./SearchField";

export default function MaterialCatalog() {
  const [level, setLevel] = useState<CatalogLevel>("variants");
  const [query, setQuery] = useState<string>("");

  const { rows: variantRows, isLoading: variantsLoading } =
    useVariantsCatalog();
  const { materials, query: materialQuery } = useMaterial();
  const { types, query: typeQuery } = useMaterialType();

  const cards: CatalogCardData[] = buildCards(level, {
    variantRows,
    materials,
    activeTypes: types,
    allTypes: typeQuery.data ?? [],
  });

  const normalizedQuery = query.trim().toLowerCase();
  const filteredCards = cards.filter((card) =>
    card.searchableText.includes(normalizedQuery),
  );

  const isLoading =
    variantsLoading || materialQuery.isLoading || typeQuery.isLoading;

  return (
    <div className="flex flex-col gap-4">
      <SearchField value={query} onChange={setQuery} />
      <LevelSwitcher value={level} onChange={setLevel} />
      <CardList cards={filteredCards} isLoading={isLoading} />
    </div>
  );
}
