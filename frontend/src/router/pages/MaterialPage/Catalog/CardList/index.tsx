import Typography from "@ui/Typography";

import type { CatalogCardData } from "../buildCards";
import CatalogCard from "../CatalogCard";

interface Props {
  cards: CatalogCardData[];
  isLoading: boolean;
}

export default function CardList(props: Props) {
  return (
    <div data-testid="material-catalog-list" className="flex flex-col gap-4">
      {!props.isLoading && props.cards.length === 0 ? (
        <Typography
          data-testid="material-catalog-empty"
          variant="caption"
          className="text-muted-foreground"
        >
          Каталог пуст
        </Typography>
      ) : (
        props.cards.map((card) => <CatalogCard key={card.key} card={card} />)
      )}
    </div>
  );
}
