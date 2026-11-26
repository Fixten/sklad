import Card from "@ui/Card";

export interface CatalogCardProps {
  title: string;
  to?: string;
  description?: string;
  content: React.ReactNode;
  actions?: React.ReactNode;
}

export default function CatalogCard(props: CatalogCardProps) {
  return (
    <Card
      title={props.title}
      titleTo={props.to}
      description={props.description}
    >
      {props.content}
      {props.actions}
    </Card>
  );
}
