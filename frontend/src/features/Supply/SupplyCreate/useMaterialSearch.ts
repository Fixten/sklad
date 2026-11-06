import { useState } from "react";

import type { MaterialCatalogRow } from "@/features/Material/useMaterialsCatalog";

export interface MaterialSearch {
  query: string;
  selected: MaterialCatalogRow | undefined;
  changeQuery: (value: string) => void;
  select: (row: MaterialCatalogRow) => void;
  clear: () => void;
}

export function useMaterialSearch(): MaterialSearch {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<MaterialCatalogRow>();

  const changeQuery = (value: string) => {
    setQuery(value);
    setSelected(undefined);
  };

  const select = (row: MaterialCatalogRow) => {
    setSelected(row);
    setQuery(row.variantName);
  };

  const clear = () => {
    setQuery("");
    setSelected(undefined);
  };

  return { query, selected, changeQuery, select, clear };
}
