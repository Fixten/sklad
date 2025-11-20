import Card from "ui/Card";
import { MaterialModel } from "./Material.model";
import IconButton from "ui/IconButton";
import { Delete, Pen } from "lucide-react";
import MaterialTypeLabel from "./MaterialType/MaterialTypeLabel";

type Props = {
  value: MaterialModel;
  onRemove: () => void;
  onChange: () => void;
};

export default function MaterialItem(props: Props) {
  const { name, description, materialType } = props.value;
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
    </Card.Wrapper>
  );
}
