import { useEffect, useRef } from "react";

interface Props {
  needClose: boolean;
  onClose: () => void;
}

export default function useClickOutside<T extends HTMLElement>(props: Props) {
  const ref = useRef<T>(null);
  const { needClose, onClose } = props;
  useEffect(() => {
    if (needClose) {
      const isOutsideOfTarget = (target: EventTarget | null): boolean =>
        !(target instanceof Node) || !ref.current?.contains(target);

      const handlePointerDown = (event: PointerEvent) => {
        if (isOutsideOfTarget(event.target)) {
          onClose();
        }
      };

      document.addEventListener("pointerdown", handlePointerDown);
      return () =>
        document.removeEventListener("pointerdown", handlePointerDown);
    }
  }, [needClose, onClose]);
  return ref;
}
