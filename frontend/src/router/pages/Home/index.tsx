import { useNavigate } from "react-router";

import { navItems } from "@/layout/App.layout";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "ui/command";

export default function Home() {
  const nav = useNavigate();

  return (
    <Command className="border shadow-md md:min-w-[450px]">
      <CommandInput placeholder="Поиск" autoFocus />
      <CommandList>
        <CommandEmpty>Нету</CommandEmpty>
        <CommandGroup heading="Меню">
          {navItems.map(({ link, name }) => (
            <CommandItem
              key={link}
              onSelect={() => {
                void nav(link);
              }}
            >
              {name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
