import { useState } from "react";

import SupplySheet from "@/features/Supply/SupplySheet";
import { Button } from "@ui/Button";

interface Props {
  initialOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function SupplySheetHarness({
  initialOpen = false,
  onOpenChange,
}: Props) {
  const [open, setOpen] = useState(initialOpen);
  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };

  return (
    <>
      {open ? null : (
        <Button
          onClick={() => {
            setOpen(true);
          }}
        >
          Открыть поставку
        </Button>
      )}
      <SupplySheet open={open} onOpenChange={handleOpenChange} />
    </>
  );
}
