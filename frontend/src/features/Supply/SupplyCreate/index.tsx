import { useNavigate } from "react-router";

import { materialPath } from "@/features/Material/materialUtils/materiaUtils";
import { formatUnitCost } from "@/features/Supply/supplyFormRules";
import { UnitShortLabels } from "@/features/units";
import pathsRouter from "@/router/paths.router";
import { Button } from "@ui/Button";
import { Form, FormField } from "@ui/Form";
import { FormInputField } from "@ui/InputField";
import OptionPicker from "@ui/OptionPicker";
import Typography from "@ui/Typography";

import { useSupplyCreate } from "./useSupplyCreate";

import type { KeyboardEvent } from "react";

export default function SupplyCreate() {
  const navigate = useNavigate();
  const {
    form,
    query,
    results,
    selected,
    unit,
    unitCost,
    status,
    isLoading,
    changeQuery,
    select,
    submit,
  } = useSupplyCreate();

  const preventClosedEnter = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Enter") return;
    if (event.currentTarget.querySelector('[role="listbox"]')) return;

    event.preventDefault();
  };

  return (
    <Form form={form} onSubmit={submit} className="flex flex-col gap-8">
      <div onKeyDownCapture={preventClosedEnter}>
        <FormField
          control={form.control}
          name="variantId"
          render={({ field, fieldState }) => (
            <OptionPicker
              id="supply-material"
              name={field.name}
              inputRef={field.ref}
              label="Материал"
              placeholder="Название, тип или вариант"
              value={query}
              autoFocus
              error={fieldState.error?.message}
              listLabel="Варианты"
              results={results.map((row) => ({
                key: String(row.variantId),
                value: row,
                label: row.variantName,
                meta: materialPath(row.material),
              }))}
              onValueChange={changeQuery}
              onSelect={select}
              onBlur={field.onBlur}
            />
          )}
        />
        {query.trim() && !selected && (isLoading || results.length === 0) ? (
          <Typography
            variant="caption"
            className="text-muted-foreground mt-2"
            aria-live="polite"
          >
            {isLoading ? "Загружаем материалы…" : "Ничего не нашлось"}
          </Typography>
        ) : null}
      </div>

      <section className="flex flex-col gap-6">
        <Typography
          variant="label"
          tagName="h2"
          className="text-muted-foreground"
        >
          Партия
        </Typography>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormInputField
            control={form.control}
            name="quantity"
            label="Количество"
            type="number"
            inputMode="decimal"
            min={unit === "pieces" ? "1" : "0.001"}
            step={unit === "pieces" ? "1" : "0.001"}
            unit={unit ? UnitShortLabels[unit] : undefined}
          />
          <FormInputField
            control={form.control}
            name="price"
            label="Цена закупки, всего"
            type="number"
            inputMode="decimal"
            min="0"
            step="any"
            unit="₽"
          />
        </div>

        {unit && unitCost ? (
          <div className="flex items-start justify-between gap-6">
            <Typography variant="label" className="text-muted-foreground">
              Цена за единицу
            </Typography>
            <div className="flex flex-col items-end gap-1 text-right">
              <Typography variant="data">
                {formatUnitCost(unitCost.value, unit)}
              </Typography>
              <Typography variant="caption" className="text-muted-foreground">
                {unitCost.formula}
              </Typography>
            </div>
          </div>
        ) : null}

        <FormInputField
          control={form.control}
          name="supplierName"
          label="Поставщик"
        />
        <FormInputField
          control={form.control}
          name="description"
          label="Описание"
        />
        <FormInputField
          control={form.control}
          name="url"
          label="Ссылка"
          placeholder="https://…"
        />
      </section>

      {status ? (
        <Typography
          variant="caption"
          role="status"
          className="text-muted-foreground"
        >
          {status}
        </Typography>
      ) : null}

      <div className="flex flex-wrap justify-end gap-3">
        <Button
          variant="ghost"
          onClick={() => {
            void navigate(pathsRouter.material);
          }}
        >
          Отмена
        </Button>
        <Button type="submit">Записать поставку</Button>
      </div>
    </Form>
  );
}
