import { useState } from "react";

import CardList from "./CardList";
import { type CatalogLevel } from "./levels";
import LevelSwitcher from "./LevelSwitcher";
import SearchField from "./SearchField";

export default function MaterialCatalog() {
  const [level, setLevel] = useState<CatalogLevel>("materials");
  const [query, setQuery] = useState<string>("");
  const [showHidden] = useState<boolean>(false);

  return (
    <div className="flex flex-col gap-4">
      <SearchField value={query} onChange={setQuery} />
      <LevelSwitcher value={level} onChange={setLevel} />
      <CardList level={level} query={query} showHidden={showHidden} />
    </div>
  );
}
