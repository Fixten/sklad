import Card from "@ui/Card";
import Typography from "@ui/Typography";

export interface CatalogCardProps {
  title: string;
  description: string;
  content: React.ReactNode;
}

export default function CatalogCard(props: CatalogCardProps) {
  return (
    <Card title={props.title} description={props.description}>
      <Typography variant="caption" className="text-muted-foreground">
        {props.content}
      </Typography>
    </Card>
  );
}
