import { useState } from "react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@base/command";
import { useCommandMenu } from "@ui/CommandMenu";

import useSlash from "./useSlash";

interface CommandPaletteItem {
  value: string;
  label: string;
  onSelect: () => void;
}

interface Props {
  items: CommandPaletteItem[];
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
  const { open, openList, close, wrapperRef, handleKeyDown } = useCommandMenu({
    onClose: () => setQuery(""),
  });

  const onSelect = () => {
    close();
    setQuery("");
  };

  useSlash({
    focusInput: () => wrapperRef.current?.querySelector("input")?.focus(),
    onOpen: openList,
  });

  return (
    <div
      ref={wrapperRef}
      data-testid="command-palette"
      className="relative w-full"
      onKeyDown={handleKeyDown}
    >
      <Command label={heading ?? placeholder} className="overflow-visible">
        <CommandInput
          placeholder={placeholder}
          value={query}
          onValueChange={(value) => {
            setQuery(value);
            openList();
          }}
          onFocus={openList}
          onClick={openList}
        />
        {open && (
          <CommandList
            label={heading ?? placeholder}
            className="bg-popover absolute inset-x-0 top-full z-50"
          >
            <CommandEmpty className="text-muted-foreground">
              {emptyMessage}
            </CommandEmpty>
            <CommandGroup heading={heading}>
              {items.map(({ value, label, onSelect: onSelectItem }) => (
                <CommandItem
                  key={value}
                  value={value}
                  keywords={[label, value]}
                  onSelect={() => {
                    onSelectItem();
                    onSelect();
                  }}
                >
                  {label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        )}
      </Command>
    </div>
  );
}
