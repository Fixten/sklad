import Card from "ui/Card";
import { MaterialModel } from "./Material.model";

type Props = {
  value: MaterialModel;
};

export default function MaterialItem(props: Props) {
  const { name, description, materialType } = props.value;
  return (
    <Card.Wrapper>
      <Card.CardHeader title={name}>{description}</Card.CardHeader>
      <Card.CardContent>Тип: {materialType}</Card.CardContent>
    </Card.Wrapper>
  );
}
