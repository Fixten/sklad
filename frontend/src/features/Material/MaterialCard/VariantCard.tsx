import { useState } from "react";

import Button from "ui/Button";
import Card from "ui/Card";

import { MaterialModelBase } from "../Material.model";
import EditVariant from "../Variant/EditVariant";
import useVariant from "../Variant/useVariant";

import type { VariantModel } from "../Material.model";
import Item from "ui/Item";
import IconButton from "ui/IconButton";
import { Delete } from "lucide-react";

interface Props {
  variants: MaterialModelBase["variants"];
  materialId: string;
}

export default function VariantCard(props: Props) {
  const [variantEdit, setVariantEdit] = useState<string | null>(null);
  const { addMutation, removeMutation } = useVariant();

  function onCloseVariant() {
    setVariantEdit(null);
  }
  async function onCreateVariant(variant: VariantModel) {
    await addMutation.mutateAsync({ materialId: props.materialId, variant });
    onCloseVariant();
  }

  function onRemove(variantId: string) {
    removeMutation.mutate({ variantId, materialId: props.materialId });
  }

  return (
    <Card.CardFooter className="flex flex-col items-start gap-4">
      <Card.CardTitle>Ваиранты</Card.CardTitle>
      {props.variants.map((v) => (
        <Item.Item variant="muted" className="w-full" key={v._id}>
          <Item.ItemContent>
            <Item.ItemTitle>{v.variant}</Item.ItemTitle>
          </Item.ItemContent>
          <Item.ItemActions>
            <IconButton onClick={() => onRemove(v._id)}>
              <Delete />
            </IconButton>
          </Item.ItemActions>
        </Item.Item>
      ))}
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
  );
}
