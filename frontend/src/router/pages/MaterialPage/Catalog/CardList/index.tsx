import Typography from "@ui/Typography";

import { CatalogLevel } from "../levels";

import CatalogCard from "./CatalogCard";
import useCardsData from "./useCardsData";

interface Props {
  level: CatalogLevel;
  query: string;
  showHidden: boolean;
}

export default function CardList(props: Props) {
  const { cards, isLoading } = useCardsData(props.level, props.showHidden);

  const filteredCards = cards.filter((card) =>
    card.search.includes(props.query.trim().toLowerCase()),
  );

  return (
    <div data-testid="material-catalog-list" className="flex flex-col gap-4">
      {!isLoading && filteredCards.length === 0 ? (
        <Typography
          data-testid="material-catalog-empty"
          variant="caption"
          className="text-muted-foreground"
        >
          Каталог пуст
        </Typography>
      ) : (
        filteredCards.map((card) => <CatalogCard key={card.id} {...card} />)
      )}
    </div>
  );
}
