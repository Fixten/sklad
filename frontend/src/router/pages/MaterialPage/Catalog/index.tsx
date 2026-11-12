import Typography from "@ui/Typography";

export default function MaterialCatalog() {
  return (
    <div data-testid="material-catalog-list" className="flex flex-col gap-4">
      <Typography
        data-testid="material-catalog-empty"
        variant="caption"
        className="text-muted-foreground"
      >
        Каталог пуст
      </Typography>
    </div>
  );
}
