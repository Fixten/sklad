import SupplyCreate from "@/features/Supply/SupplyCreate";
import PageLayout from "@/layout/PageLayout";
import pathsRouter from "@/router/paths.router";

export default function SupplyPage() {
  return (
    <PageLayout
      back={{ to: pathsRouter.material, label: "Материалы" }}
      title="Поставка"
    >
      <SupplyCreate />
    </PageLayout>
  );
}
