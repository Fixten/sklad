import Typography from "../Typography";

import type { ReactNode } from "react";

interface Props {
  label: string;
  note?: string;
  children: ReactNode;
}

export default function Panel({ label, note, children }: Props) {
  return (
    <div data-slot="panel" className="bg-card flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between gap-4">
        <Typography variant="label" className="text-muted-foreground">
          {label}
        </Typography>
        {note ? (
          <Typography variant="label" className="text-muted-foreground">
            {note}
          </Typography>
        ) : null}
      </div>
      {children}
    </div>
  );
}
