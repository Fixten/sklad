import SupplyCreate from "@/features/Supply/SupplyCreate";
import pathsRouter from "@/router/paths.router";
import Link from "@ui/Link";
import Typography from "@ui/Typography";

export default function SupplyPage() {
  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <Link
        to={pathsRouter.material}
        unstyled
        className="type-label text-muted-foreground hover:text-foreground w-fit focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        ← Материалы
      </Link>
      <Typography variant="display">Поставка</Typography>
      <SupplyCreate />
    </div>
  );
}
