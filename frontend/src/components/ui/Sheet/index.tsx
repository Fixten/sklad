import { Dialog, DialogContent, DialogTitle } from "@base/dialog";
import { Separator } from "@base/separator";
import Typography from "@ui/Typography";

import type { ReactNode } from "react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  step: string;
  hint?: ReactNode;
  error?: ReactNode;
  back?: ReactNode;
  actions: ReactNode;
  children: ReactNode;
}

export default function Sheet({
  open,
  onOpenChange,
  title,
  step,
  hint,
  error,
  back,
  actions,
  children,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-slot="sheet"
        className="bg-popover flex flex-col gap-6 overflow-hidden sm:max-w-[560px]"
      >
        <div className="flex items-start justify-between gap-6">
          <DialogTitle>{title}</DialogTitle>
          <Typography variant="label" className="text-foreground shrink-0">
            {step}
          </Typography>
        </div>
        <Separator />
        <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto">
          {children}
        </div>
        <div className="flex flex-col gap-4">
          {error ? (
            <Typography
              variant="body"
              role="alert"
              className="bg-destructive text-destructive-foreground w-fit max-w-full self-end px-2 py-1"
            >
              {error}
            </Typography>
          ) : null}
          <div className="flex min-h-10 flex-wrap items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-4">
              {back}
              {hint ? <div className="type-body min-w-0">{hint}</div> : null}
            </div>
            <div className="ml-auto flex shrink-0 items-center gap-2">
              {actions}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
