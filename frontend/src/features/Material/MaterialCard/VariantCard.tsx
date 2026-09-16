import { useState } from "react";

import Button from "ui/Button";
import Card from "ui/Card";

import EditVariant from "../Variant/EditVariant";
import useVariant from "../Variant/useVariant";

import Item from "ui/Item";
import IconButton from "ui/IconButton";
import { Delete } from "lucide-react";
import { Variant } from "../Variant/Variant.model";

interface Props {
  variants: Variant[];
  materialId: number;
}

export default function VariantCard(props: Props) {
  const [variantEdit, setVariantEdit] = useState<number | null>(null);
  const { addMutation, removeMutation } = useVariant();

  function onCloseVariant() {
    setVariantEdit(null);
  }
  async function onCreateVariant(variant: Variant) {
    await addMutation.mutateAsync(variant);
    onCloseVariant();
  }

  function onRemove(variantId: number) {
    removeMutation.mutate(variantId);
  }

  return (
    <Card.CardFooter className="flex flex-col items-start gap-4">
      <Card.CardTitle>Ваиранты</Card.CardTitle>
      {props.variants.map((v) => (
        <Item.Item variant="muted" className="w-full" key={v.id}>
          <Item.ItemContent>
            <Item.ItemTitle>{v.variant}</Item.ItemTitle>
          </Item.ItemContent>
          <Item.ItemActions>
            <IconButton onClick={() => onRemove(v.id)}>
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
