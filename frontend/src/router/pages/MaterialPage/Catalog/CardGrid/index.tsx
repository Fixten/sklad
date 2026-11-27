import Typography from "@ui/Typography";

interface Props {
  loading: boolean;
  count: number;
  children: React.ReactNode;
  empty?: React.ReactNode;
}

export default function CardGrid(props: Props) {
  return (
    <div
      data-testid="material-catalog-list"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2"
    >
      {!props.loading && props.count === 0
        ? (props.empty ?? (
            <Typography
              data-testid="material-catalog-empty"
              variant="caption"
              className="text-muted-foreground col-span-full py-8 text-center"
            >
              Каталог пуст
            </Typography>
          ))
        : props.children}
    </div>
  );
}
