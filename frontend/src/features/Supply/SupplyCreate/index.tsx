import { materialPath } from "@/features/Material/materialUtils/materiaUtils";
import useMaterial from "@/features/Material/useMaterial";
import useMaterialType from "@/features/MaterialType/useMaterialType";
import { unitCostPreview } from "@/features/Supply/supplyFormRules";
import { Button } from "@ui/Button";
import { Form, FormField } from "@ui/Form";
import OptionPicker from "@ui/OptionPicker";

import DetailsFields from "./DetailsFields";
import TargetPickers from "./TargetPickers";
import { useMaterialSearch } from "./useMaterialSearch";
import { useSupplyForm } from "./useSupplyForm";

import type { MaterialCatalogRow } from "@/features/Material/useMaterialsCatalog";

export default function SupplyCreate() {
  const material = useMaterialSearch();
  const { materials } = useMaterial();
  const { types } = useMaterialType();
  const { form, quantity, price, unit, submit, setTarget, clearQueryTarget } =
    useSupplyForm();
  const { control } = form;
  const unitCost = unit
    ? unitCostPreview({ quantity, price }, unit)
    : undefined;
  const hasQuery = material.query.trim().length > 0;
  const materialLoading = hasQuery && !material.selected && material.isLoading;
  const materialOptions = material.results.map((row) => ({
    key: String(row.variantId),
    value: row,
    label: row.variantName,
    meta: materialPath(row.material),
  }));

  const handleQueryChange = (value: string) => {
    if (material.selected) {
      clearQueryTarget();
    }
    material.changeQuery(value);
  };

  const handleSelect = (row: MaterialCatalogRow) => {
    setTarget(row);
    material.select(row);
  };

  return (
    <Form form={form} onSubmit={submit} className="flex flex-col gap-8">
      <FormField
        control={control}
        name="variantId"
        render={({ field, fieldState }) => (
          <OptionPicker
            id="supply-material"
            name={field.name}
            inputRef={field.ref}
            label="Поиск"
            placeholder="Название, тип или вариант"
            value={material.query}
            autoFocus
            error={fieldState.error?.message}
            loading={materialLoading}
            listLabel="Варианты"
            results={materialOptions}
            onValueChange={handleQueryChange}
            onSelect={handleSelect}
            onBlur={field.onBlur}
          />
        )}
      />

      <TargetPickers types={types} materials={materials} />

      <DetailsFields
        control={control}
        unit={unit ?? undefined}
        unitCost={unitCost}
      />

      <Button type="submit" className="self-end">
        Сохранить
      </Button>
    </Form>
  );
}
