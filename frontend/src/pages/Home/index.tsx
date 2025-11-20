import { navItems } from "@/layout/App.layout";
import { useNavigate } from "react-router";
import Command from "ui/Command";

export default function Home() {
  const nav = useNavigate();

  return (
    <Command.Wrapper className="rounded-lg border shadow-md md:min-w-[450px]">
      <Command.CommandInput placeholder="Поиск" autoFocus />
      <Command.CommandList>
        <Command.CommandEmpty>Нету</Command.CommandEmpty>
        <Command.CommandGroup heading="Меню">
          {navItems.map(({ link, name }) => (
            <Command.CommandItem onSelect={() => nav(link)}>
              {name}
            </Command.CommandItem>
          ))}
        </Command.CommandGroup>
      </Command.CommandList>
    </Command.Wrapper>
  );
}
