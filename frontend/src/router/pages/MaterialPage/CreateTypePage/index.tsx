import { useNavigate } from "react-router";

import PageLayout from "@/layout/PageLayout";
import pathsRouter from "@/router/paths.router";

import TypeEditForm from "../TypePage/EditForm";

export default function CreateTypePage() {
  const navigate = useNavigate();

  return (
    <PageLayout
      back={{ to: pathsRouter.material, label: "Материалы" }}
      title="Добавить тип"
    >
      <TypeEditForm onDone={() => void navigate(pathsRouter.material)} />
    </PageLayout>
  );
}
