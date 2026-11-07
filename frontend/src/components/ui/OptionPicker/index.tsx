import {
  useState,
  type ChangeEvent,
  type ComponentProps,
  type KeyboardEvent,
  type Ref,
} from "react";

import { Command, CommandItem, CommandList } from "@base/command";
import { useCommandMenu } from "@ui/CommandMenu";
import { PlusIcon } from "@ui/Icon";
import { InputField } from "@ui/InputField";
import Typography from "@ui/Typography";

export interface OptionItem<T extends string | number> {
  value: T;
  label: string;
  meta?: string;
}

interface Props<T extends string | number> {
  id: string;
  label: string;
  query: string;
  name?: string;
  placeholder?: string;
  hint?: string;
  error?: string;
  loading?: boolean;
  autoFocus?: boolean;
  inputRef?: Ref<HTMLInputElement>;
  onQueryChange: (value: string) => void;
  onSelect: (value: T) => void;
  onBlur?: ComponentProps<"input">["onBlur"];
  options: OptionItem<T>[];
  listLabel: string;
  create?: {
    createLabel: string;
    onCreate: () => void;
  };
}

const rowClassName =
  "h-12 cursor-pointer gap-3 px-4 data-selected:bg-muted data-selected:shadow-[inset_2px_0_0_0_var(--primary)] [&>svg:last-child]:hidden";

const createRowClassName = `${rowClassName} order-first`;

export default function OptionPicker<T extends string | number>(
  props: Props<T>,
) {
  const {
    id,
    label,
    query,
    name,
    placeholder,
    hint,
    error,
    loading,
    autoFocus,
    inputRef,
    onQueryChange,
    onSelect,
    onBlur,
    options,
    create,
    listLabel,
  } = props;
  const { open, openList, close, wrapperRef, handleKeyDown } = useCommandMenu({
    closeOnOutside: "click",
  });
  const expanded = open && (options.length > 0 || Boolean(create));

  const [firstOption] = options;
  const [inputRow, setInputRow] = useState("");
  const [appliedQuery, setAppliedQuery] = useState(query);
  if (query !== appliedQuery) {
    setAppliedQuery(query);
    setInputRow("");
  }
  const rowValues = new Set(options.map((option) => String(option.value)));
  if (create) rowValues.add("create");
  const defaultRow =
    firstOption !== undefined
      ? String(firstOption.value)
      : create
        ? "create"
        : "";
  const activeRow = rowValues.has(inputRow) ? inputRow : defaultRow;

  const handleWrapperKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!open && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
      event.preventDefault();
      openList();
    }
    if (expanded) handleKeyDown(event);
  };

  const handleFieldKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Tab") close();
    if (event.key === "Enter" && !expanded) event.stopPropagation();
  };

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    openList();
    onQueryChange(event.currentTarget.value);
  };

  return (
    <div
      ref={wrapperRef}
      className="flex flex-col"
      onFocus={openList}
      onKeyDown={handleWrapperKeyDown}
    >
      <Command
        shouldFilter={false}
        loop
        value={activeRow}
        onValueChange={setInputRow}
        className="gap-6 bg-transparent"
      >
        <InputField
          id={id}
          ref={inputRef}
          name={name}
          label={label}
          placeholder={placeholder}
          hint={hint}
          error={error}
          loading={loading}
          autoFocus={autoFocus}
          value={query}
          onBlur={onBlur}
          role="combobox"
          aria-expanded={expanded}
          aria-autocomplete="list"
          onChange={handleQueryChange}
          onClick={openList}
          onKeyDown={handleFieldKeyDown}
        />
        {expanded ? (
          <CommandList
            label={listLabel}
            className="max-h-none **:[[cmdk-list-sizer]]:flex **:[[cmdk-list-sizer]]:flex-col"
          >
            {options.map((option) => (
              <CommandItem
                key={String(option.value)}
                value={String(option.value)}
                className={rowClassName}
                onSelect={() => {
                  close();
                  onSelect(option.value);
                }}
              >
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
                ) : undefined}
              </CommandItem>
            ))}
            {create ? (
              <CommandItem
                key="create"
                value="create"
                className={createRowClassName}
                onSelect={() => {
                  close();
                  create.onCreate();
                }}
              >
                <PlusIcon className="shrink-0" />
                <Typography variant="body" className="min-w-0 truncate">
                  {create.createLabel}
                </Typography>
              </CommandItem>
            ) : null}
          </CommandList>
        ) : null}
      </Command>
    </div>
  );
}

export type { Props as OptionPickerProps };
