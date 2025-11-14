import { Button, Stack, TextField } from "@mui/material";
import { useState } from "react";

import { MaterialDTO } from "./Material.model";
import SelectMaterialType from "./SelectMaterialType";

type Props = {
  onSubmit: (v: MaterialDTO) => void;
  isError: boolean;
};

export default function AddMaterial(props: Props) {
  const [isShown, setIsShown] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [type, setType] = useState<string>("");

  const onChangeName: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => setName(e.target.value);

  const onChangeDescription: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => setDescription(e.target.value);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    props.onSubmit({ name, description, materialType: type });
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
          <Stack useFlexGap spacing={2}>
            <TextField
              label="Название"
              value={name}
              onChange={onChangeName}
              error={props.isError}
            />
            <TextField
              label="Описание"
              value={description}
              onChange={onChangeDescription}
              error={props.isError}
            />
            <SelectMaterialType
              value={type}
              onChange={setType}
              isError={props.isError}
            />
            <Button type="submit">Создать</Button>
          </Stack>
        </form>
      )}
    </>
  );
}
