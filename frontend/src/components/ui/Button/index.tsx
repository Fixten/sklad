import { Button as BaseButton } from "@base/button";
import { Spinner } from "@ui/Spinner";

import type { ComponentProps } from "react";

type Props = ComponentProps<typeof BaseButton> & {
  pending?: boolean;
  pendingLabel?: string;
};

function Button({
  type = "button",
  pending = false,
  pendingLabel,
  children,
  ...props
}: Props) {
  return (
    <BaseButton {...props} type={type} aria-busy={pending ? true : undefined}>
      {pending ? <Spinner aria-hidden="true" data-icon="inline-start" /> : null}
      {pending ? (pendingLabel ?? children) : children}
    </BaseButton>
  );
}

export { Button };
export { buttonVariants } from "@base/button";
export type { Props as ButtonProps };
