import { useNavigate } from "react-router";

import PageLayout from "@/layout/PageLayout";
import pathsRouter from "@/router/paths.router";

import MaterialEditForm from "../MaterialCardPage/EditForm";

export default function CreateMaterialPage() {
  const navigate = useNavigate();

  return (
    <PageLayout
      back={{ to: pathsRouter.material, label: "Материалы" }}
      title="Добавить материал"
    >
      <MaterialEditForm onDone={() => void navigate(pathsRouter.material)} />
    </PageLayout>
  );
}
