import { useFormContext } from "react-hook-form";

import {
  materialPath,
  queryMaterialRow,
} from "@/features/Material/materialUtils/materiaUtils";
import useMaterialsCatalog, {
  type MaterialCatalogRow,
} from "@/features/Material/useMaterialsCatalog";
import OptionPicker from "@ui/OptionPicker";

import type { SupplyDraft, SupplyFormValues } from "../../supplyForm";
import type { MaterialSearch } from "../../useMaterialSearch";

interface Props {
  search: MaterialSearch;
}

export default function SearchField(props: Props) {
  const catalog = useMaterialsCatalog();
  const { setValue, clearErrors } = useFormContext<
    SupplyFormValues,
    unknown,
    SupplyDraft
  >();

  const selectedVariantId = props.search.selected?.variantId;
  const matchingRows = queryMaterialRow(
    catalog.rows,
    props.search.query,
  ).filter((row) => row.variantId !== selectedVariantId);
  const options = matchingRows.map((row) => ({
    value: row.variantId,
    label: row.variantName,
    meta: materialPath(row.material),
  }));

  const setTarget = (row: MaterialCatalogRow) => {
    setValue("typeId", row.material.materialTypeId, { shouldDirty: true });
    setValue("typeName", "", { shouldDirty: true });
    setValue("typeQuery", row.material.materialTypeName, {
      shouldDirty: true,
    });
    setValue("materialId", row.material.id, { shouldDirty: true });
    setValue("materialName", "", { shouldDirty: true });
    setValue("materialQuery", row.material.name, { shouldDirty: true });
    setValue("variantId", row.variantId, { shouldDirty: true });
    setValue("variantName", "", { shouldDirty: true });
    setValue("variantQuery", row.variantName, { shouldDirty: true });
    setValue("unit", row.unit, { shouldDirty: true });
    clearErrors(["unit", "typeName", "materialName", "variantName"]);
  };

  const clearQueryTarget = () => {
    setValue("variantId", null, { shouldDirty: true });
  };

  const onQueryChange = (value: string) => {
    if (props.search.selected) {
      clearQueryTarget();
    }
    props.search.changeQuery(value);
  };

  const onQuerySelect = (variantId: number) => {
    const row = matchingRows.find(
      (candidate) => candidate.variantId === variantId,
    );

    if (!row) return;

    setTarget(row);
    props.search.select(row);
  };

  return (
    <OptionPicker
      id="supply-query"
      label="Поиск"
      placeholder="Название, тип или вариант"
      query={props.search.query}
      autoFocus
      loading={catalog.isLoading}
      listLabel="Варианты"
      options={options}
      onQueryChange={onQueryChange}
      onSelect={onQuerySelect}
    />
  );
}
