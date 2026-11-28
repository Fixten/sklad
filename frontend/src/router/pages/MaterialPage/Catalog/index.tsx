import { useState } from "react";
import type { ReactNode } from "react";

import Typography from "@/components/ui/Typography";
import { Button } from "@ui/Button";

import MaterialEditForm from "../MaterialCardPage/EditForm";
import TypeEditForm from "../TypePage/EditForm";
import VariantEditForm from "../VariantPage/EditForm";

import { type CatalogLevel } from "./levels";
import LevelSwitcher from "./LevelSwitcher";
import MaterialCards from "./MaterialCards";
import SearchField from "./SearchField";
import TypeCards from "./TypeCards";
import VariantCards from "./VariantCards";

const addLabels: Record<CatalogLevel, string> = {
  materials: "Добавить материал",
  variants: "Добавить вариант",
  types: "Добавить тип",
};

export default function MaterialCatalog() {
  const [level, setLevel] = useState<CatalogLevel>("materials");
  const [query, setQuery] = useState<string>("");
  const [showHidden, setShowHidden] = useState<boolean>(false);
  const [hasHidden, setHasHidden] = useState<boolean>(false);
  const [creating, setCreating] = useState<boolean>(false);
  const effectiveShowHidden = hasHidden && showHidden;

  function handleLevelChange(next: CatalogLevel) {
    setLevel(next);
    setCreating(false);
    setHasHidden(false);
  }

  function closeCreate() {
    setCreating(false);
  }

  let createForm: ReactNode;
  let cardList: ReactNode;
  if (level === "types") {
    createForm = <TypeEditForm onDone={closeCreate} />;
    cardList = (
      <TypeCards
        query={query}
        showHidden={effectiveShowHidden}
        setHasHidden={setHasHidden}
      />
    );
  } else if (level === "materials") {
    createForm = <MaterialEditForm onDone={closeCreate} />;
    cardList = (
      <MaterialCards
        query={query}
        showHidden={effectiveShowHidden}
        setHasHidden={setHasHidden}
      />
    );
  } else {
    createForm = <VariantEditForm onDone={closeCreate} />;
    cardList = (
      <VariantCards
        query={query}
        showHidden={effectiveShowHidden}
        setHasHidden={setHasHidden}
      />
    );
  }

  const addLabel = addLabels[level];

  return (
    <div className="flex flex-col gap-4">
      {creating ? (
        <div className="pt-2">
          <Typography variant="title" className="mb-10">
            {addLabel}
          </Typography>
          {createForm}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <SearchField value={query} onChange={setQuery} />
            <LevelSwitcher value={level} onChange={handleLevelChange} />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Button onClick={() => setCreating(true)}>{addLabel}</Button>
            {hasHidden && (
              <Button
                onClick={() => setShowHidden((value) => !value)}
                aria-pressed={effectiveShowHidden}
                variant="ghost"
              >
                {effectiveShowHidden ? "Скрыть скрытые" : "Показать скрытые"}
              </Button>
            )}
          </div>
          {cardList}
        </>
      )}
    </div>
  );
}
