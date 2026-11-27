import Link from "@ui/Link";
import Typography from "@ui/Typography";

interface Props {
  createTo: string;
}

export default function SuppliesEmpty(props: Props) {
  return (
    <div className="col-span-full flex flex-col items-center gap-2 py-8 text-center">
      <Typography variant="caption" className="text-muted-foreground">
        Поставок нет
      </Typography>
      <Link to={props.createTo}>Сделать поставку</Link>
    </div>
  );
}
