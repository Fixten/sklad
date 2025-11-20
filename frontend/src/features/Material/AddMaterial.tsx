import { ComponentProps, useState } from "react";
import EditMaterial from "./EditMaterial";
import Button from "ui/Button";

export default function AddMaterial(
  props: ComponentProps<typeof EditMaterial>
) {
  const [isShown, setIsShown] = useState<boolean>(false);

  return (
    <>
      {
        <Button onClick={() => setIsShown((prev) => !prev)}>
          {isShown ? "Скрыть форму" : "Создать новый"}
        </Button>
      }
      {isShown && <EditMaterial {...props} />}
    </>
  );
}
