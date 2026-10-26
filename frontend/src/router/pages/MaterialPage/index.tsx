import { useState } from "react";

import SupplySheet from "@/features/Supply/SupplySheet";
import CommandPalette from "@ui/CommandPalette";

export default function MaterialPage() {
  const [isSupplyOpen, setSupplyOpen] = useState(false);

  return (
    <>
      <CommandPalette
        heading="Действия"
        emptyMessage="Ничего не нашлось"
        items={[
          {
            key: "supply",
            label: "Сделать поставку",
            onSelect: () => {
              setSupplyOpen(true);
            },
          },
        ]}
      />
      <SupplySheet open={isSupplyOpen} onOpenChange={setSupplyOpen} />
    </>
  );
}
