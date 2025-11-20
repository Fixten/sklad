import { useState } from "react";
import * as z from "zod";

import { MaterialDTO } from "./Material.model";
import SelectMaterialType from "./SelectMaterialType";
import Button from "ui/button";
import Input from "ui/Input";

type Props = {
  onSubmit: (v: MaterialDTO) => void;
  isError: boolean;
};

const Material = z.object({
  name: z.string().min(3),
  description: z.string().min(5).optional(),
  materialType: z.string().min(1),
});

export default function AddMaterial(props: Props) {
  const [isShown, setIsShown] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [type, setType] = useState<string>("");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const item = { name, description, materialType: type };
    try {
      console.log(Material.parse(item));
      if (Material.parse(item)) props.onSubmit(item);
      setName("");
      setDescription("");
      setType("");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      {
        <Button onClick={() => setIsShown((prev) => !prev)}>
          {isShown ? "Скрыть форму" : "Создать новый"}
        </Button>
      }
      {isShown && (
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
            <Button type="submit">Создать</Button>
          </div>
        </form>
      )}
    </>
  );
}
