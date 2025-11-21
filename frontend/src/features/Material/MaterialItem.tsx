import { Delete, Pen } from "lucide-react";
import { useState } from "react";

import Button from "ui/Button";
import Card from "ui/Card";
import IconButton from "ui/IconButton";

import { MaterialModel, VariantModel } from "./Material.model";
import MaterialTypeLabel from "./MaterialType/MaterialTypeLabel";
import EditVariant from "./Variant/EditVariant";
import useVariant from "./Variant/useVariant";

interface Props {
  materialId: string;
  value: MaterialModel;
  onRemove: () => void;
  onChange: () => void;
}

export default function MaterialItem(props: Props) {
  const { name, description, materialType } = props.value;
  const { addMutation } = useVariant();
  const [variantEdit, setVariantEdit] = useState<string | null>(null);
  function onCloseVariant() {
    setVariantEdit(null);
  }

  async function onCreateVariant(variant: VariantModel) {
    await addMutation.mutateAsync({ materialId: props.materialId, variant });
    onCloseVariant();
  }

  return (
    <Card.Wrapper>
      <Card.CardHeader>
        {name}
        <Card.CardAction className="flex gap-2">
          <IconButton onClick={props.onRemove}>
            <Delete />
          </IconButton>
          <IconButton onClick={props.onChange}>
            <Pen />
          </IconButton>
        </Card.CardAction>
      </Card.CardHeader>
      <Card.CardDescription className="pl-2">
        Описание: {description}
      </Card.CardDescription>
      <Card.CardContent>
        Тип: <MaterialTypeLabel id={materialType} />
      </Card.CardContent>
      <Card.CardFooter>
        {variantEdit === null ? (
          <Button
            onClick={() => {
              setVariantEdit("");
            }}
          >
            Добавить вариант
          </Button>
        ) : (
          <EditVariant onClose={onCloseVariant} onSubmit={onCreateVariant} />
        )}
      </Card.CardFooter>
    </Card.Wrapper>
  );
}
