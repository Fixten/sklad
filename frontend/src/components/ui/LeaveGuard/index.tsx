import { useBlocker } from "react-router";

import { Button } from "@ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@ui/Dialog";

interface Props {
  shouldBlock: boolean;
}

function LeaveGuard({ shouldBlock: shouldBlock }: Props) {
  const blocker = useBlocker(shouldBlock);

  return blocker.state === "blocked" ? (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) blocker.reset();
      }}
    >
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Уйти?</DialogTitle>
          <DialogDescription>Данные не сохранены</DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={blocker.reset}>
            Остаться
          </Button>
          <Button onClick={blocker.proceed}>Уйти</Button>
        </div>
      </DialogContent>
    </Dialog>
  ) : null;
}

export { LeaveGuard };
export type { Props as LeaveGuardProps };
