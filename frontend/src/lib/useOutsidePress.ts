import { useEffect, useEffectEvent, useRef } from "react";

import type { RefObject } from "react";

type CloseOn = "pointerdown" | "click";

interface OutsidePressOptions {
  ref: RefObject<HTMLElement | null>;
  active: boolean;
  closeOn?: CloseOn;
  onOutside: () => void;
}

export function useOutsidePress({
  ref,
  active,
  closeOn = "pointerdown",
  onOutside,
}: OutsidePressOptions) {
  const pressStartedOutsideRef = useRef(false);
  const dismiss = useEffectEvent(onOutside);

  useEffect(() => {
    pressStartedOutsideRef.current = false;

    if (!active) return;

    const isOutside = (target: EventTarget | null) =>
      !(target instanceof Node) || !ref.current?.contains(target);

    if (closeOn === "pointerdown") {
      const handlePointerDown = (event: PointerEvent) => {
        if (isOutside(event.target)) dismiss();
      };

      document.addEventListener("pointerdown", handlePointerDown);

      return () => {
        document.removeEventListener("pointerdown", handlePointerDown);
      };
    }

    // Unmounting an in-flow element on pointerdown moves whatever sits below the
    // pointer before the click lands, so the close waits for the matching click.
    // A press that began before the element opened never arms it.
    const handlePointerDown = (event: PointerEvent) => {
      pressStartedOutsideRef.current = isOutside(event.target);
    };

    const handleClick = (event: MouseEvent) => {
      const startedOutside = pressStartedOutsideRef.current;
      pressStartedOutsideRef.current = false;

      if (startedOutside && isOutside(event.target)) dismiss();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("click", handleClick);
    };
  }, [ref, active, closeOn]);
}
