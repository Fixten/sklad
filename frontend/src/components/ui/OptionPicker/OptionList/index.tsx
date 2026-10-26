import { cn } from "cn";

import Typography from "@ui/Typography";

import type { ReactNode } from "react";

export const listDomId = (id: string): string => `${id}-list`;

export const optionDomId = (listId: string, index: number): string =>
  `${listId}-option-${String(index)}`;

export interface OptionItem {
  key: string;
  label: string;
  meta?: string;
  icon?: ReactNode;
}

interface Props {
  id: string;
  ariaLabel: string;
  options: OptionItem[];
  activeKey: string | null;
  onActivate: (key: string) => void;
  onSelect: (key: string) => void;
}

export default function OptionList(props: Props) {
  const { id, ariaLabel, options, activeKey, onActivate, onSelect } = props;

  return (
    <ul
      id={id}
      role="listbox"
      aria-label={ariaLabel}
      className="flex list-none flex-col"
    >
      {options.map((option, index) => {
        const isActive = option.key === activeKey;

        return (
          <li
            key={option.key}
            id={optionDomId(id, index)}
            role="option"
            tabIndex={-1}
            aria-selected={isActive}
            className={cn(
              "flex h-12 cursor-pointer items-center gap-3 px-4",
              isActive && "bg-muted shadow-[inset_2px_0_0_0_var(--primary)]",
            )}
            onMouseMove={() => {
              onActivate(option.key);
            }}
            onClick={() => {
              onSelect(option.key);
            }}
          >
            {option.icon ?? null}
            <Typography variant="body" className="min-w-0 truncate">
              {option.label}
            </Typography>
            {option.meta ? (
              <Typography
                variant="caption"
                className="text-muted-foreground ml-auto shrink-0 uppercase"
              >
                {option.meta}
              </Typography>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
