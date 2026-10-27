import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { expect } from "vitest";
import { render } from "vitest-browser-react";

import { errorResponse, stubRoutes } from "@/test/apiStub";
import { Button } from "@ui/Button";

import SupplySheet from ".";

import type { components } from "@/api/schema";
import type { JsonBody } from "@/api/schema-helpers";

type Schemas = components["schemas"];

interface Catalog {
  types: Schemas["MaterialType"][];
  materials: Schemas["Material"][];
  variants: Schemas["MaterialVariant"][];
}

export interface StubOptions {
  suppliers?: Schemas["Supplier"][];
  supplyFailure?: { status: number; message: string };
  typesResponse?: Promise<Response>;
}

const createdAt = "2026-01-01T00:00:00Z";

export const fullCatalog: Catalog = {
  types: [{ id: 1, name: "Пиломатериал", created_at: createdAt }],
  materials: [
    { id: 10, name: "Дуб", material_type_id: 1, created_at: createdAt },
  ],
  variants: [
    {
      id: 100,
      name: "Доска 40 мм",
      unit: "meters",
      material_id: 10,
      created_at: createdAt,
    },
    {
      id: 101,
      name: "Брусок 60 × 60",
      unit: "meters",
      material_id: 10,
      created_at: createdAt,
    },
    {
      id: 102,
      name: "Рейка 20 × 40",
      unit: "pieces",
      material_id: 10,
      created_at: createdAt,
    },
    {
      id: 103,
      name: "Заготовка",
      unit: "meters",
      material_id: 99,
      created_at: createdAt,
    },
  ],
};

export const emptyCatalog: Catalog = { types: [], materials: [], variants: [] };

export const fullSuppliers: Schemas["Supplier"][] = [
  { id: 5, name: "Столярный двор", created_at: createdAt },
  { id: 6, name: "Лесоторг", created_at: createdAt },
];

const createdSupply = (
  body: JsonBody<"/api/supply", "post">,
  variants: Schemas["MaterialVariant"][],
): Schemas["Supply"] => {
  const variant = variants.find(
    (candidate) => candidate.id === body.material_variant_id,
  );

  return {
    id: 30,
    description: body.description ?? null,
    purchase_price: Number(body.purchase_price),
    quantity: Number(body.quantity),
    unit: variant?.unit ?? "meters",
    remaining_quantity: Number(body.quantity),
    unit_purchase_cost: Number(body.purchase_price) / Number(body.quantity),
    url: body.url ?? null,
    material_variant_id: body.material_variant_id,
    supplier_id: body.supplier_id ?? null,
    created_at: createdAt,
  };
};

export const stubApi = (
  catalog: Catalog = fullCatalog,
  options: StubOptions = {},
) =>
  stubRoutes({
    "/api/supplier": {
      get: () => options.suppliers ?? fullSuppliers,
      post: ({ body }) => ({ id: 9, name: body.name, created_at: createdAt }),
    },
    "/api/supply": {
      get: () => [],
      post: ({ body }) =>
        options.supplyFailure
          ? errorResponse(
              options.supplyFailure.status,
              options.supplyFailure.message,
            )
          : createdSupply(body, catalog.variants),
    },
    "/api/material-type": {
      get: () => options.typesResponse ?? catalog.types,
      post: ({ body }) => ({ id: 7, name: body.name, created_at: createdAt }),
    },
    "/api/material": {
      get: () => catalog.materials,
      post: ({ body }) => ({
        id: 20,
        name: body.name,
        material_type_id: body.material_type_id,
        created_at: createdAt,
      }),
    },
    "/api/material-variant": {
      get: () => catalog.variants,
      post: ({ body }) => ({
        id: 200,
        name: body.name,
        unit: body.unit,
        material_id: body.material_id,
        created_at: createdAt,
      }),
    },
  });

const SheetHarness = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open ? null : (
        <Button
          onClick={() => {
            setOpen(true);
          }}
        >
          Открыть поставку
        </Button>
      )}
      <SupplySheet open={open} onOpenChange={setOpen} />
    </>
  );
};

export const renderSheet = async () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <SheetHarness />
    </QueryClientProvider>,
  );
};

export type SheetPage = Awaited<ReturnType<typeof renderSheet>>;

export const openSheet = async (screen: SheetPage) => {
  await screen.getByRole("button", { name: "Открыть поставку" }).click();

  const dialog = screen.getByRole("dialog");
  await expect.element(dialog).toBeInTheDocument();

  return dialog;
};

export const openDetails = async (screen: SheetPage) => {
  await openSheet(screen);
  await screen.getByLabelText("Материал").fill("Дуб");
  await screen.getByRole("option", { name: /Доска 40 мм/ }).click();
  await expect.element(screen.getByText("02 / 02")).toBeInTheDocument();
};

export const selectSupplier = async (screen: SheetPage, name: string) => {
  await screen.getByLabelText("Поставщик").fill(name);
  await screen.getByRole("option", { name: new RegExp(name) }).click();
};

export const fillDetails = async (screen: SheetPage) => {
  await screen.getByLabelText("Количество").fill("8");
  await screen.getByLabelText("Цена закупки, всего").fill("24000");
  await selectSupplier(screen, "Столярный двор");
};
