import { Button } from "@ui/Button";
import { Form } from "@ui/Form";
import InlineError from "@ui/InlineError";
import { LeaveGuard } from "@ui/LeaveGuard";

import DetailsFields from "./DetailsFields";
import TargetFields from "./TargetFields";
import useSupplyCreateForm from "./useSupplyCreateForm";

export default function SupplyCreate() {
  const { form, onSubmit, error } = useSupplyCreateForm();
  const when = form.formState.isDirty && !form.formState.isSubmitting;

  return (
    <Form form={form} onSubmit={onSubmit} className="flex flex-col gap-8">
      <TargetFields />
      <DetailsFields />
      <InlineError message={error} />
      <Button
        type="submit"
        pending={form.formState.isSubmitting}
        pendingLabel="Сохраняем…"
        className="self-end"
      >
        Сохранить
      </Button>
      <LeaveGuard when={when} />
    </Form>
  );
}
