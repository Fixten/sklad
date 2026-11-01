import { materialPath } from "@/features/Material/materialUtils/materiaUtils";
import { unitCostPreview } from "@/features/Supply/supplyFormRules";
import { Button } from "@ui/Button";
import { Form, FormField } from "@ui/Form";
import OptionPicker from "@ui/OptionPicker";

import DetailsFields from "./DetailsFields";
import { useMaterialSearch } from "./useMaterialSearch";
import { useSupplyForm } from "./useSupplyForm";

import type { MaterialCatalogRow } from "@/features/Material/useMaterialsCatalog";

const createTarget = {
  createLabel: "Создать",
  onCreate: () => undefined,
};

export default function SupplyCreate() {
  const material = useMaterialSearch();
  const { form, quantity, price, submit, setTarget, clearTarget } =
    useSupplyForm();
  const { control } = form;
  const unit = material.selected?.unit;
  const unitCost = unit && unitCostPreview({ quantity, price }, unit);
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
      clearTarget();
    }
    material.changeQuery(value);
  };

  const handleSelect = (row: MaterialCatalogRow) => {
    setTarget({ variantId: row.variantId, unit: row.unit });
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
            label="Материал"
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
            create={createTarget}
          />
        )}
      />

      <DetailsFields control={control} unit={unit} unitCost={unitCost} />

      <Button type="submit" className="self-end">
        Записать поставку
      </Button>
    </Form>
  );
}
