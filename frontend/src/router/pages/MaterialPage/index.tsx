import CommandPalette from "@ui/CommandPalette";

export default function MaterialPage() {
  return (
    <CommandPalette
      items={[]}
      placeholder="Поиск действий"
      emptyMessage="Пока нет действий"
    />
  );
}
