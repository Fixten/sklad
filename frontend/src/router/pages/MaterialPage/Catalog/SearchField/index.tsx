import type { ChangeEvent } from "react";

import { InputField } from "@ui/InputField";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchField(props: Props) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    props.onChange(event.currentTarget.value);
  }

  return (
    <InputField
      label="Поиск"
      placeholder="Найти..."
      value={props.value}
      onChange={handleChange}
    />
  );
}
