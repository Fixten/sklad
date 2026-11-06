import { useRef, useState } from "react";
import type { KeyboardEvent, RefObject } from "react";

import { useOutsidePress } from "@/lib/useOutsidePress/useOutsidePress";

interface Props {
  onClose?: () => void;
  closeOnOutside?: "pointerdown" | "click";
}

export interface UseCommandMenuResult {
  wrapperRef: RefObject<HTMLDivElement | null>;
  open: boolean;
  openList: () => void;
  close: () => void;
  handleKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
}

export function useCommandMenu(props: Props = {}): UseCommandMenuResult {
  const { onClose, closeOnOutside = "pointerdown" } = props;
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const openList = () => {
    setOpen(true);
  };
  const close = () => {
    setOpen(false);
  };
  const dismiss = () => {
    setOpen(false);
    onClose?.();
  };

  useOutsidePress({
    ref: wrapperRef,
    active: open,
    closeOn: closeOnOutside,
    onOutside: dismiss,
  });

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (open && event.key === "Escape") {
      event.stopPropagation();
      dismiss();
    }
  };

  return { wrapperRef, open, openList, close, handleKeyDown };
}
