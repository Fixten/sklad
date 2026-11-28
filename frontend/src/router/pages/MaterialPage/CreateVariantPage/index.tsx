import { useNavigate } from "react-router";

import PageLayout from "@/layout/PageLayout";
import pathsRouter from "@/router/paths.router";

import VariantEditForm from "../VariantPage/EditForm";

export default function CreateVariantPage() {
  const navigate = useNavigate();

  return (
    <PageLayout
      back={{ to: pathsRouter.material, label: "Материалы" }}
      title="Добавить вариант"
    >
      <VariantEditForm onDone={() => void navigate(pathsRouter.material)} />
    </PageLayout>
  );
}
