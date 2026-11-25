import Typography from "@ui/Typography";

interface Props {
  loading: boolean;
  count: number;
  children: React.ReactNode;
}

export default function CardGrid(props: Props) {
  return (
    <div data-testid="material-catalog-list" className="flex flex-col gap-4">
      {!props.loading && props.count === 0 ? (
        <Typography
          data-testid="material-catalog-empty"
          variant="caption"
          className="text-muted-foreground"
        >
          Каталог пуст
        </Typography>
      ) : (
        props.children
      )}
    </div>
  );
}
