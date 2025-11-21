import { useState } from "react";
import zod from "zod";

import Button from "ui/Button";
import Form from "ui/Form";
import Input from "ui/Input";

import { VariantModel } from "../Material.model";

interface Props {
  onClose: () => void;
  onSubmit: (v: VariantModel) => Promise<unknown>;
}

const validator = zod.object({
  name: zod.string().min(2),
});

export default function EditVariant(props: Props) {
  const [name, setName] = useState<string>("");

  async function onSubmit() {
    try {
      validator.parse({ name });
      await props.onSubmit({ variant: name });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Form onSubmit={onSubmit} className="flex items-end gap-4">
      <Input label="Название" onChange={setName} />
      <Button type="submit">Сохранить</Button>
      <Button onClick={props.onClose}>Отменить</Button>
    </Form>
  );
}
