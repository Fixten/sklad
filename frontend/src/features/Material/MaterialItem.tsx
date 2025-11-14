import { Card, CardContent, CardHeader } from "@mui/material";
import { MaterialModel } from "./Material.model";

type Props = {
  value: MaterialModel;
};

export default function MaterialItem(props: Props) {
  const { name, description, materialType } = props.value;
  return (
    <Card>
      <CardHeader title={name} subheader={description} />
      <CardContent>Тип: {materialType}</CardContent>
    </Card>
  );
}
