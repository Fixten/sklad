import { Button } from "@ui/Button";
import { Form, useZodForm } from "@ui/Form";

import DetailsFields from "./DetailsFields";
import { createSupplyFormSchema, supplyFormDefaults } from "./supplyForm";
import TargetFields from "./TargetFields";

const supplyFormSchema = createSupplyFormSchema();

export default function SupplyCreate() {
  const form = useZodForm({
    schema: supplyFormSchema,
    defaultValues: supplyFormDefaults,
  });

  return (
    <Form
      form={form}
      onSubmit={() => undefined}
      className="flex flex-col gap-8"
    >
      <TargetFields />
      <DetailsFields />
      <Button type="submit" className="self-end">
        Сохранить
      </Button>
    </Form>
  );
}
