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
      action={props.actions}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">{props.content}</div>
      </div>
    </Card>
  );
}
