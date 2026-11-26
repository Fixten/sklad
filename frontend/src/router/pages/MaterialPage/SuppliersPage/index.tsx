import PageLayout from "@/layout/PageLayout";
import pathsRouter from "@/router/paths.router";

export default function SuppliersPage() {
  return (
    <PageLayout
      back={{ to: pathsRouter.material, label: "Материалы" }}
      title="Поставщики"
    />
  );
}
