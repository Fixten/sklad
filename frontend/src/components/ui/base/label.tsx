import { cn } from "cn";
import * as React from "react";

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "type-label peer-data-[slot=checkbox]:type-body peer-data-[slot=radio-group-item]:type-body peer-data-[slot=switch]:type-body flex items-center gap-2 select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 peer-data-[slot=checkbox]:tracking-normal peer-data-[slot=checkbox]:normal-case peer-data-[slot=radio-group-item]:tracking-normal peer-data-[slot=radio-group-item]:normal-case peer-data-[slot=switch]:tracking-normal peer-data-[slot=switch]:normal-case",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
