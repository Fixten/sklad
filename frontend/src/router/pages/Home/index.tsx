import { useNavigate } from "react-router";

import { navItems } from "@/layout/App.layout";
import CommandPalette from "@ui/CommandPalette";

export default function Home() {
  const nav = useNavigate();

  const items = navItems.map(({ link, name }) => ({
    key: link,
    label: name,
    onSelect: () => {
      void nav(link);
    },
  }));

  return <CommandPalette heading="Меню" items={items} />;
}
