import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { MemoryRouter, Route, Routes } from "react-router";
import { render } from "vitest-browser-react";

import { supplyPageRoutes } from "@/features/Supply/testFixtures";
import type { RecordedRequest, Routes as StubRoutes } from "@/test/apiStub";
import { stubRoutes } from "@/test/apiStub.vitest";
import { Form, useZodForm } from "@ui/Form";

import { createSupplyFormSchema, supplyFormDefaults } from "./supplyForm";
import type { SupplyFormValues } from "./supplyForm";

const supplyFormSchema = createSupplyFormSchema();

interface HarnessProps {
  children: ReactNode;
  defaults?: Partial<SupplyFormValues>;
  submit: boolean;
}

function Harness(props: HarnessProps) {
  const form = useZodForm({
    schema: supplyFormSchema,
    defaultValues: { ...supplyFormDefaults, ...props.defaults },
  });

  return (
    <Form
      form={form}
      onSubmit={() => undefined}
      className="flex flex-col gap-8"
    >
      {props.children}
      {props.submit && <button type="submit">Сохранить</button>}
    </Form>
  );
}

interface RenderOptions {
  defaults?: Partial<SupplyFormValues>;
  form?: boolean;
  submit?: boolean;
  routes?: StubRoutes;
}

export async function renderSupply(
  children: ReactNode,
  options: RenderOptions = {},
) {
  const requests: RecordedRequest[] = stubRoutes(
    options.routes ?? supplyPageRoutes,
  );

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });

  const content =
    options.form === false ? (
      children
    ) : (
      <Harness defaults={options.defaults} submit={options.submit ?? true}>
        {children}
      </Harness>
    );

  const screen = await render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/material/supply"]}>
        <Routes>
          <Route path="/material/supply" element={content} />
          <Route path="/material" element={<div>Материалы</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );

  return Object.assign(screen, { requests });
}

export type Screen = Awaited<ReturnType<typeof renderSupply>>;

export async function selectDoska(screen: Screen) {
  await screen.getByLabelText("Поиск").fill("Дуб");
  await screen.getByRole("option", { name: /Доска 40 мм/ }).click();
}
