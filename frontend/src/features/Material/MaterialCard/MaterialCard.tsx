import { Delete, Pen } from "lucide-react";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "ui/card";
import IconButton from "ui/IconButton";
import { Separator } from "ui/separator";

import MaterialTypeLabel from "../../MaterialType/MaterialTypeLabel";

import type { MaterialModel } from "../Material.model";

interface Props {
  materialId: number;
  value: MaterialModel;
  onRemove: () => void;
  onChange: () => void;
}

export default function MaterialCard(props: Props) {
  const { name, description, material_type_id } = props.value;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardAction className="flex gap-2">
          <IconButton onClick={props.onRemove}>
            <Delete />
          </IconButton>
          <IconButton onClick={props.onChange}>
            <Pen />
          </IconButton>
        </CardAction>
      </CardHeader>
      <CardDescription className="px-(--card-spacing)">
        Описание: {description}
      </CardDescription>
      <CardContent>
        Тип: <MaterialTypeLabel id={material_type_id} />
      </CardContent>
      <Separator />
    </Card>
  );
}
