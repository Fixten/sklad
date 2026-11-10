import type { ComboboxRootChangeEventDetails } from "@base-ui/react";
import { useId, useRef, useState } from "react";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  useComboboxFilter,
} from "@base/combobox";
import { Field, FieldDescription, FieldError } from "@base/field";
import { InputGroupAddon } from "@base/input-group";
import { Spinner } from "@ui/Spinner";

import OptionPickerLabel from "./OptionPickerLabel";

export interface OptionPickerOption {
  value: string;
  label: string;
  keywords?: string[];
  newItemLabel?: string;
}

export interface OptionPickerProps {
  label: string;
  listLabel?: string;
  value?: string;
  onSelect: (v: string) => void;
  options: OptionPickerOption[];
  name?: string;
  placeholder?: string;
  error?: string;
  loading?: boolean;
  canCreate?: boolean;
}

const getNewItemLabel = (label: string): string => `Создать ${label}`;

function getOptionsWithNewItem(options: OptionPickerOption[], query: string) {
  const trimmedQuery = query.trim();
  return trimmedQuery.length > 0
    ? [
        {
          value: trimmedQuery,
          label: getNewItemLabel(trimmedQuery),
          newItemLabel: trimmedQuery,
        },
        ...options,
      ]
    : options;
}

function getSelectedOption(options: OptionPickerOption[], value?: string) {
  if (typeof value === "undefined") return undefined;
  else return options.find((v) => v.value === value) ?? null;
}

export default function OptionPicker(props: OptionPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const hintId = useId();
  const [query, setQuery] = useState("");
  const filter = useComboboxFilter();

  const optionsWithNewItem = getOptionsWithNewItem(props.options, query);
  const options =
    props.canCreate && !props.value ? optionsWithNewItem : props.options;

  function onQuery(v: string, event: ComboboxRootChangeEventDetails) {
    if (event.reason === "input-change") {
      setQuery(v);
      props.onSelect("");
    } else if (event.reason === "input-clear") {
      setQuery("");
    }
  }

  function onFilter(option: OptionPickerOption, query: string) {
    return (
      option.value === query ||
      [option.label, ...(option.keywords ?? [])].some((v) =>
        filter.contains(v, query),
      )
    );
  }

  const selectedOption = getSelectedOption(optionsWithNewItem, props.value);

  const hint = selectedOption?.newItemLabel ? "Создать" : undefined;

  function onSelect(option: OptionPickerOption | null) {
    props.onSelect(option?.value ?? "");
  }

  return (
    <Field>
      <OptionPickerLabel inputRef={inputRef}>{props.label}</OptionPickerLabel>
      <Combobox
        value={selectedOption}
        onValueChange={onSelect}
        onInputValueChange={onQuery}
        items={options}
        itemToStringLabel={(opt) => opt.newItemLabel ?? opt.label}
        name={props.name}
        filter={onFilter}
      >
        <ComboboxInput
          ref={inputRef}
          placeholder={props.placeholder}
          aria-describedby={hint ? hintId : undefined}
        >
          {props.loading && (
            <InputGroupAddon align="inline-end">
              <Spinner />
            </InputGroupAddon>
          )}
        </ComboboxInput>
        <ComboboxContent>
          <ComboboxList aria-label={props.listLabel}>
            {(option: OptionPickerOption) => (
              <ComboboxItem key={option.value} value={option}>
                {option.label}
              </ComboboxItem>
            )}
          </ComboboxList>
          <ComboboxEmpty>
            {props.loading ? <Spinner /> : "Ничего."}
          </ComboboxEmpty>
        </ComboboxContent>
      </Combobox>
      {hint && <FieldDescription id={hintId}>{hint}</FieldDescription>}
      {props.error && <FieldError>{props.error}</FieldError>}
    </Field>
  );
}
