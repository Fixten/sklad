import { useRef, useState } from "react";

import { useOutsidePress } from "@/lib/useOutsidePress/useOutsidePress";
import { optionDomId, type OptionItem } from "@ui/OptionPicker/OptionList";

import type { KeyboardEvent, ReactNode } from "react";

export type OptionPickerRow<T> =
  | {
      kind: "create";
      key: "create";
      label: string;
      icon: ReactNode;
    }
  | (Omit<OptionItem, "key"> & {
      kind: "result";
      key: `result:${string}`;
      value: T;
    });

interface ActiveRequest {
  inputValue: string;
  key: string;
}

interface UseOptionPickerOptions<T> {
  inputValue: string;
  listId: string;
  rows: OptionPickerRow<T>[];
  onSelect: (value: T) => void;
  onCreate?: () => void;
}

function resolveActiveIndex<T>(
  rows: OptionPickerRow<T>[],
  requestedKey: string | null,
) {
  const requestedIndex =
    requestedKey === null
      ? -1
      : rows.findIndex((row) => row.key === requestedKey);

  if (requestedIndex >= 0) return requestedIndex;

  const firstResultIndex = rows.findIndex((row) => row.kind === "result");
  if (firstResultIndex >= 0) return firstResultIndex;

  return rows.length > 0 ? 0 : -1;
}

export function useOptionPicker<T>({
  inputValue,
  listId,
  rows,
  onSelect,
  onCreate,
}: UseOptionPickerOptions<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeRequest, setActiveRequest] = useState<ActiveRequest | null>(
    null,
  );
  const wrapperRef = useRef<HTMLDivElement>(null);

  const open = () => {
    setIsOpen(true);
  };
  const close = () => {
    setIsOpen(false);
  };

  useOutsidePress({
    ref: wrapperRef,
    active: isOpen,
    closeOn: "click",
    onOutside: close,
  });

  const requestedKey =
    activeRequest !== null && activeRequest.inputValue === inputValue
      ? activeRequest.key
      : null;
  const activeIndex = resolveActiveIndex(rows, requestedKey);
  const activeKey = rows[activeIndex]?.key ?? null;
  const rowsCount = rows.length;
  const expanded = isOpen && rowsCount > 0;
  const activeDescendantId =
    expanded && activeIndex >= 0 ? optionDomId(listId, activeIndex) : undefined;

  const activate = (key: string) => {
    setActiveRequest({ inputValue, key });
  };

  const moveActive = (delta: number) => {
    const nextIndex = (activeIndex + delta + rowsCount) % rowsCount;
    const nextRow = rows[nextIndex];
    if (nextRow) {
      activate(nextRow.key);
    }
  };

  const select = (key: string) => {
    close();

    const row = rows.find((candidate) => candidate.key === key);

    if (row?.kind === "create") {
      onCreate?.();
    } else if (row) {
      onSelect(row.value);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (rowsCount === 0) return;

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!expanded) {
        open();
        return;
      }
      moveActive(event.key === "ArrowDown" ? 1 : -1);
      return;
    }
    if (event.key === "Enter") {
      if (!expanded || activeKey === null) return;
      event.preventDefault();
      select(activeKey);
      return;
    }
    if (event.key === "Escape" && expanded) {
      event.preventDefault();
      event.stopPropagation();
      close();
      return;
    }
    if (event.key === "Tab") {
      close();
    }
  };

  return {
    wrapperRef,
    expanded,
    activeKey,
    activeDescendantId,
    open,
    activate,
    select,
    handleKeyDown,
  };
}
