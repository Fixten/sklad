import { cn } from "cn";

import { Button as ButtonPrimitive, buttonVariants } from "@base/button";
import { Spinner } from "@ui/Spinner";

import type { VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

type Props = ComponentProps<typeof ButtonPrimitive> &
  VariantProps<typeof buttonVariants> & {
    pending?: boolean;
    pendingLabel?: string;
  };

function Button({
  className,
  variant = "default",
  size = "default",
  type = "button",
  pending = false,
  pendingLabel,
  children,
  ...props
}: Props) {
  return (
    <ButtonPrimitive
      data-slot="button"
      type={type}
      aria-busy={pending ? true : undefined}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {pending ? <Spinner aria-hidden="true" data-icon="inline-start" /> : null}
      {pending ? (pendingLabel ?? children) : children}
    </ButtonPrimitive>
  );
}

export { Button, buttonVariants };
export type { Props as ButtonProps };
