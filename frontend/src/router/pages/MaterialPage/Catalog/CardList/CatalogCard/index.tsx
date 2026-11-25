import Card from "@ui/Card";

export interface CatalogCardProps {
  title: string;
  description?: string;
  content: React.ReactNode;
}

export default function CatalogCard(props: CatalogCardProps) {
  return (
    <Card title={props.title} description={props.description}>
      {props.content}
    </Card>
  );
}
