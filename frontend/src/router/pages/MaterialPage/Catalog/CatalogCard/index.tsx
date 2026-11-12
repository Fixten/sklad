import Card from "@ui/Card";
import Typography from "@ui/Typography";

import type { CatalogCardData } from "../buildCards";

interface Props {
  card: CatalogCardData;
}

export default function CatalogCard(props: Props) {
  return (
    <Card title={props.card.title} description={props.card.description}>
      {props.card.context ? (
        <Typography variant="caption" className="text-muted-foreground">
          {props.card.context}
        </Typography>
      ) : null}
    </Card>
  );
}
