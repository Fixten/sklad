import { cn } from "cn";
import * as React from "react";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "placeholder:text-muted-foreground focus-visible:border-b-ring aria-invalid:border-b-invalid type-input border-b-input flex field-sizing-content min-h-24 w-full resize-none rounded-none border border-x-transparent border-t-transparent bg-transparent px-0 py-3 transition-[color,border-color] outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
