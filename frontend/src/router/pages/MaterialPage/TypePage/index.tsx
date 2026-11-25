import { useParams } from "react-router";

import useMaterialTypeData from "@/features/MaterialType/useMaterialType";
import PageLayout from "@/layout/PageLayout";
import pathsRouter from "@/router/paths.router";
import Typography from "@ui/Typography";

import MaterialCards from "../Catalog/CardList/MaterialCards";

const back = { to: pathsRouter.material, label: "Материалы" };

export default function TypePage() {
  const { id } = useParams();
  const types = useMaterialTypeData();

  if (types.query.isLoading) {
    return <PageLayout back={back} title="" />;
  }

  const type = types.getMap().get(Number(id));
  if (!type) {
    return <PageLayout back={back} title="Запись не найдена" />;
  }

  return (
    <PageLayout back={back} title={type.name}>
      {type.description ? <Typography>{type.description}</Typography> : null}
      <MaterialCards query="" showHidden={false} typeId={type.id} />
    </PageLayout>
  );
}
