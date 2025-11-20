import { useState } from "react";
import * as z from "zod";

import { MaterialDTO, MaterialModel } from "./Material.model";
import SelectMaterialType from "./SelectMaterialType";
import Button from "ui/Button";
import Input from "ui/Input";

type Props = {
  onSubmit: (v: MaterialDTO) => void;
  isError: boolean;
  value?: MaterialModel;
};

const Material = z.object({
  name: z.string().min(3),
  description: z.string().min(5).optional(),
  materialType: z.string().min(1),
});

export default function EditMaterial(props: Props) {
  const [name, setName] = useState<string>(props.value?.name || "");
  const [description, setDescription] = useState<string>(
    props.value?.description || ""
  );
  const [type, setType] = useState<string>(props.value?.materialType || "");
  console.log(type);
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const item = {
      name,
      description: description || undefined,
      materialType: type,
    };
    try {
      if (Material.parse(item)) props.onSubmit(item);
      setName("");
      setDescription("");
      setType("");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="flex items-end gap-4">
        <Input
          label="Название"
          value={name}
          onChange={setName}
          error={props.isError}
          required
        />
        <Input
          label="Описание"
          value={description}
          onChange={setDescription}
          error={props.isError}
        />
        <SelectMaterialType
          value={type}
          onChange={setType}
          error={props.isError}
          required
          label="Тип материала"
        />
        <Button type="submit">{props.value ? "Изменить" : "Создать"}</Button>
      </div>
    </form>
  );
}
