import { useEffect } from "react";
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
  when: boolean;
}

function LeaveGuard({ when }: Props) {
  const blocker = useBlocker(when);

  useEffect(() => {
    if (!when) return;

    const handler = (event: BeforeUnloadEvent) => event.preventDefault();

    window.addEventListener("beforeunload", handler);

    return () => window.removeEventListener("beforeunload", handler);
  }, [when]);

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
