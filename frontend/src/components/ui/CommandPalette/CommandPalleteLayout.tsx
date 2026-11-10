import { KeyboardEvent, useRef } from "react";

import useClickOutside from "@/lib/useClickOutside";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@base/command";
import { FieldError } from "@base/field.jsx";

export interface CommandPaletteOption {
  value: string;
  label: string;
  onSelect: () => void;
  keywords?: string[];
}

interface Props {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  heading?: string;
  error?: string;
  name?: string;
  loading?: boolean;
  placeholder?: string;
  query: string;
  onQuery: (v: string) => void;
  emptyMessage?: string;
  options: CommandPaletteOption[];
  onSelect?: (item: CommandPaletteOption) => void;
}

export default function CommandPalleteLayout(props: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (props.isOpen && event.key === "Escape") {
      event.stopPropagation();
      props.setIsOpen(false);
    }
  };

  const clickOutsideRef = useClickOutside<HTMLDivElement>({
    needClose: props.isOpen,
    onClose: () => props.setIsOpen(false),
  });

  function onInput(v: string) {
    props.onQuery(v);
    props.setIsOpen(true);
  }

  return (
    <div
      ref={clickOutsideRef}
      data-testid="command-palette"
      className="relative flex flex-col items-start gap-2"
      onKeyDown={handleKeyDown}
    >
      <Command
        label={props.heading}
        className="overflow-visible"
        value={props.query}
        onValueChange={onInput}
      >
        <CommandInput
          ref={inputRef}
          name={props.name}
          placeholder={props.placeholder}
          loading={props.loading}
          onFocus={() => props.setIsOpen(true)}
        />
        <FieldError className="w-full">{props.error}</FieldError>
        {props.isOpen && (
          <CommandList
            label={props.heading}
            className="bg-popover absolute inset-x-0 top-full z-50"
          >
            <CommandEmpty className="text-muted-foreground">
              {props.emptyMessage}
            </CommandEmpty>
            <CommandGroup heading={props.heading}>
              {props.options.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  keywords={[item.label, item.value, ...(item.keywords ?? [])]}
                  onSelect={() => {
                    item.onSelect();
                    props.setIsOpen(false);
                    props.onSelect?.(item);
                  }}
                >
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        )}
      </Command>
    </div>
  );
}
