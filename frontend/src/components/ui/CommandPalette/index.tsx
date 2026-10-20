import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

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

const isTypingTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;

  return ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
};

export default function CommandPalette({
  items,
  heading,
  placeholder = "Поиск",
  emptyMessage = "Нету",
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  const close = () => {
    setOpen(false);
    setQuery("");
  };

  useEffect(() => {
    const handleShortcut = (event: globalThis.KeyboardEvent) => {
      const isSlash = event.key === "/" || event.code === "Slash";
      if (!isSlash || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }
      if (isTypingTarget(event.target)) return;

      event.preventDefault();
      setOpen(true);
      wrapperRef.current?.querySelector("input")?.focus();
    };

    document.addEventListener("keydown", handleShortcut);
    return () => {
      document.removeEventListener("keydown", handleShortcut);
    };
  }, []);

  useLayoutEffect(() => {
    wrapperRef.current
      ?.querySelector("input")
      ?.setAttribute("aria-expanded", String(open));
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (wrapperRef.current?.contains(event.target as Node)) return;

      close();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [open]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Escape") return;

    event.preventDefault();
    close();
  };

  return (
    <div
      ref={wrapperRef}
      data-testid="command-palette"
      className="relative w-full"
      onKeyDown={handleKeyDown}
    >
      <Command
        label={heading ?? placeholder}
        className="overflow-visible shadow-md"
      >
        <CommandInput
          placeholder={placeholder}
          value={query}
          onValueChange={(value) => {
            setQuery(value);
            setOpen(true);
          }}
          onFocus={() => {
            setOpen(true);
          }}
          onClick={() => {
            setOpen(true);
          }}
        />
        {open && (
          <CommandList
            label={heading ?? placeholder}
            className="bg-popover absolute inset-x-0 top-full z-50 shadow-md"
          >
            <CommandEmpty className="text-muted-foreground">
              {emptyMessage}
            </CommandEmpty>
            <CommandGroup heading={heading}>
              {items.map(({ key, label, onSelect }) => (
                <CommandItem
                  key={key}
                  onSelect={() => {
                    onSelect();
                    close();
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
