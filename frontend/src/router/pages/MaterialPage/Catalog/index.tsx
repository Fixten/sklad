import { useState } from "react";
import type { ReactNode } from "react";

import { Button } from "@ui/Button";

import MaterialEditForm from "../MaterialCardPage/EditForm";
import TypeEditForm from "../TypePage/EditForm";
import VariantEditForm from "../VariantPage/EditForm";

import CardList from "./CardList";
import { type CatalogLevel } from "./levels";
import LevelSwitcher from "./LevelSwitcher";
import SearchField from "./SearchField";

const addLabels: Record<CatalogLevel, string> = {
  materials: "Добавить материал",
  variants: "Добавить вариант",
  types: "Добавить тип",
};

export default function MaterialCatalog() {
  const [level, setLevel] = useState<CatalogLevel>("materials");
  const [query, setQuery] = useState<string>("");
  const [showHidden] = useState<boolean>(false);
  const [creating, setCreating] = useState<boolean>(false);

  function handleLevelChange(next: CatalogLevel) {
    setLevel(next);
    setCreating(false);
  }

  function closeCreate() {
    setCreating(false);
  }

  let createForm: ReactNode;
  if (level === "types") {
    createForm = <TypeEditForm onDone={closeCreate} />;
  } else if (level === "materials") {
    createForm = <MaterialEditForm onDone={closeCreate} />;
  } else {
    createForm = <VariantEditForm onDone={closeCreate} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <SearchField value={query} onChange={setQuery} />
      <LevelSwitcher value={level} onChange={handleLevelChange} />
      {creating ? (
        createForm
      ) : (
        <Button onClick={() => setCreating(true)}>{addLabels[level]}</Button>
      )}
      <CardList level={level} query={query} showHidden={showHidden} />
    </div>
  );
}
