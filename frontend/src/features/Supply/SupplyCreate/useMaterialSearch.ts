import { useState } from "react";

import { queryMaterialRow } from "@/features/Material/materialUtils/materiaUtils";
import useMaterialsCatalog, {
  type MaterialCatalogRow,
} from "@/features/Material/useMaterialsCatalog";

export function useMaterialSearch() {
  const catalog = useMaterialsCatalog();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<MaterialCatalogRow | null>(null);
  const results = selected ? [] : queryMaterialRow(catalog.rows, query);

  const changeQuery = (value: string) => {
    setQuery(value);

    if (selected) {
      setSelected(null);
    }
  };

  const select = (row: MaterialCatalogRow) => {
    setSelected(row);
    setQuery(row.variantName);
  };

  return {
    query,
    selected,
    results,
    isLoading: catalog.isLoading,
    changeQuery,
    select,
  };
}
