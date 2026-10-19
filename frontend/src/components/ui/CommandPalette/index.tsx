import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@base/command";

interface CommandPaletteItem {
  key: string;
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
  placeholder = "Поиск",
  emptyMessage = "Нету",
}: Props) {
  return (
    <Command className="border shadow-md md:min-w-[450px]">
      <CommandInput placeholder={placeholder} autoFocus />
      <CommandList>
        <CommandEmpty>{emptyMessage}</CommandEmpty>
        <CommandGroup heading={heading}>
          {items.map(({ key, label, onSelect }) => (
            <CommandItem key={key} onSelect={onSelect}>
              {label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
