import type { ReactElement, ReactNode } from "react";

import {
  Popover as BasePopover,
  PopoverContent,
  PopoverTrigger,
} from "@base/popover";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: ReactElement;
  children: ReactNode;
}

export default function Popover(props: Props) {
  return (
    <BasePopover open={props.open} onOpenChange={props.onOpenChange}>
      <PopoverTrigger render={props.trigger} />
      <PopoverContent className="flex w-72 flex-col gap-3">
        {props.children}
      </PopoverContent>
    </BasePopover>
  );
}
