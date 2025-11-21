import { Delete, Pen } from "lucide-react";

import Card from "ui/Card";
import Divider from "ui/Divider";
import IconButton from "ui/IconButton";

import MaterialTypeLabel from "../MaterialType/MaterialTypeLabel";

import VariantCard from "./VariantCard";

import type { MaterialModel } from "../Material.model";

interface Props {
  materialId: string;
  value: MaterialModel;
  onRemove: () => void;
  onChange: () => void;
}

export default function MaterialCard(props: Props) {
  const { name, description, materialType } = props.value;

  return (
    <Card.Wrapper>
      <Card.CardHeader>
        <Card.CardTitle>{name}</Card.CardTitle>
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
      <Divider />
      <VariantCard
        variants={props.value.variants}
        materialId={props.materialId}
      />
    </Card.Wrapper>
  );
}
