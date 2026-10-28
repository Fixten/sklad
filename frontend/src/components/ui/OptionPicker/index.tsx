import { PlusIcon } from "@ui/Icon";
import { InputField } from "@ui/InputField";
import OptionList, {
  listDomId,
  type OptionItem,
} from "@ui/OptionPicker/OptionList";

import { useOptionPicker, type OptionPickerRow } from "./useOptionPicker";

import type { ComponentProps, Ref } from "react";

export interface OptionPickerItem<T> extends OptionItem {
  value: T;
}

interface OptionPickerBaseProps<T> {
  id: string;
  label: string;
  value: string;
  name?: string;
  placeholder?: string;
  hint?: string;
  error?: string;
  autoFocus?: boolean;
  inputRef?: Ref<HTMLInputElement>;
  onValueChange: (value: string) => void;
  onSelect: (value: T) => void;
  onBlur?: ComponentProps<"input">["onBlur"];
  results: OptionPickerItem<T>[];
  listLabel: string;
  create?: {
    createLabel: string;
    onCreate: () => void;
  };
}

type OptionPickerProps<T> = OptionPickerBaseProps<T>;

export default function OptionPicker<T>(props: OptionPickerProps<T>) {
  const {
    id,
    label,
    value,
    name,
    placeholder,
    hint,
    error,
    autoFocus,
    inputRef,
    onValueChange,
    onSelect,
    onBlur,
    results,
    create,
    listLabel,
  } = props;
  const listId = listDomId(id);

  const resultRows: OptionPickerRow<T>[] = results.map((item) => ({
    ...item,
    kind: "result",
    key: `result:${item.key}`,
  }));

  const rows = create
    ? [
        {
          kind: "create",
          key: "create",
          label: create.createLabel,
          icon: <PlusIcon />,
        } as OptionPickerRow<T>,
        ...resultRows,
      ]
    : resultRows;

  const {
    wrapperRef,
    expanded,
    activeKey,
    activeDescendantId,
    open,
    activate,
    select,
    handleKeyDown,
  } = useOptionPicker({
    inputValue: value,
    listId,
    rows,
    onSelect,
    onCreate: create?.onCreate,
  });

  return (
    <div ref={wrapperRef} className="flex flex-col gap-6" onFocus={open}>
      <InputField
        id={id}
        ref={inputRef}
        name={name}
        label={label}
        placeholder={placeholder}
        hint={hint}
        error={error}
        autoFocus={autoFocus}
        value={value}
        onBlur={onBlur}
        role="combobox"
        aria-expanded={expanded}
        aria-controls={expanded ? listId : undefined}
        aria-autocomplete="list"
        aria-activedescendant={activeDescendantId}
        onChange={(event) => {
          open();
          onValueChange(event.currentTarget.value);
        }}
        onClick={open}
        onKeyDown={handleKeyDown}
      />
      {expanded ? (
        <OptionList
          id={listId}
          ariaLabel={listLabel}
          options={rows}
          activeKey={activeKey}
          onActivate={activate}
          onSelect={select}
        />
      ) : null}
    </div>
  );
}

export type { OptionPickerProps };
