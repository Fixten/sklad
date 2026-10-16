import { Input as InputPrimitive } from "@base-ui/react/input";
import { cn } from "cn";
import * as React from "react";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "border-b-input file:text-foreground placeholder:text-muted-foreground focus-visible:border-b-ring aria-invalid:border-b-destructive type-input file:type-body h-10 w-full min-w-0 border border-transparent bg-transparent px-0 py-1 transition-[color,border-color] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
