import { useState } from "react";
import type { ReactNode } from "react";

import { Button } from "@ui/Button";

import { type CatalogLevel } from "./levels";
import LevelSwitcher from "./LevelSwitcher";
import MaterialCards from "./MaterialCards";
import SearchField from "./SearchField";
import TypeCards from "./TypeCards";
import VariantCards from "./VariantCards";

export default function MaterialCatalog() {
  const [level, setLevel] = useState<CatalogLevel>("materials");
  const [query, setQuery] = useState<string>("");
  const [showHidden, setShowHidden] = useState<boolean>(false);
  const [hasHidden, setHasHidden] = useState<boolean>(false);
  const effectiveShowHidden = hasHidden && showHidden;

  function handleLevelChange(next: CatalogLevel) {
    setLevel(next);
    setHasHidden(false);
  }

  let cardList: ReactNode;
  if (level === "types") {
    cardList = (
      <TypeCards
        query={query}
        showHidden={effectiveShowHidden}
        setHasHidden={setHasHidden}
      />
    );
  } else if (level === "materials") {
    cardList = (
      <MaterialCards
        query={query}
        showHidden={effectiveShowHidden}
        setHasHidden={setHasHidden}
      />
    );
  } else {
    cardList = (
      <VariantCards
        query={query}
        showHidden={effectiveShowHidden}
        setHasHidden={setHasHidden}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <SearchField value={query} onChange={setQuery} />
        <LevelSwitcher value={level} onChange={handleLevelChange} />
      </div>
      {hasHidden && (
        <div className="flex flex-wrap items-center justify-end gap-4">
          <Button
            onClick={() => setShowHidden((value) => !value)}
            aria-pressed={effectiveShowHidden}
            variant="ghost"
          >
            {effectiveShowHidden ? "Скрыть скрытые" : "Показать скрытые"}
          </Button>
        </div>
      )}
      {cardList}
    </div>
  );
}
