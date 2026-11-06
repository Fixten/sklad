import { useEffect } from "react";

const isTypingTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;

  return ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
};

interface Props {
  onOpen: () => void;
  focusInput: () => void;
}

export default function useSlash(props: Props) {
  const { onOpen, focusInput } = props;
  useEffect(() => {
    const handleShortcut = (event: globalThis.KeyboardEvent) => {
      const isSlash = event.key === "/" || event.code === "Slash";
      if (!isSlash || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }
      if (isTypingTarget(event.target)) return;

      event.preventDefault();
      onOpen();
      focusInput();
    };

    document.addEventListener("keydown", handleShortcut);
    return () => {
      document.removeEventListener("keydown", handleShortcut);
    };
  }, [onOpen, focusInput]);
}
