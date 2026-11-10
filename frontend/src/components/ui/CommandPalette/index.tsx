import { useState } from "react";

import CommandPalleteLayout from "./CommandPalleteLayout";
import type { CommandPaletteOption } from "./CommandPalleteLayout";

interface Props {
  items: CommandPaletteOption[];
  heading?: string;
  placeholder?: string;
  emptyMessage?: string;
}

export default function CommandPalette({
  items,
  heading,
  placeholder = "Начать работу",
  emptyMessage = "Нету",
}: Props) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const onSelect = () => {
    setQuery("");
  };

  return (
    <CommandPalleteLayout
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      heading={heading}
      placeholder={placeholder}
      query={query}
      onQuery={setQuery}
      emptyMessage={emptyMessage}
      options={items}
      onSelect={onSelect}
    />
  );
}
