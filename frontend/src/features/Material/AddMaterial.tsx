import { ComponentProps, useState } from "react";

import Button from "ui/Button";

import EditMaterial from "./EditMaterial";

export default function AddMaterial(
  props: ComponentProps<typeof EditMaterial>
) {
  const [isShown, setIsShown] = useState<boolean>(false);

  return (
    <>
      {
        <Button onClick={() => { setIsShown((prev) => !prev); }}>
          {isShown ? "Скрыть форму" : "Создать новый"}
        </Button>
      }
      {isShown && <EditMaterial {...props} />}
    </>
  );
}
