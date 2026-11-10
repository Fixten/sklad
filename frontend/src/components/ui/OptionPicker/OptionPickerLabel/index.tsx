import { useEffect, useState } from "react";
import type { RefObject } from "react";

import { FieldLabel } from "@base/field";

interface Props {
  inputRef: RefObject<HTMLInputElement | null>;
  children: React.ReactNode;
}

export default function OptionPickerLabel(props: Props) {
  const { inputRef } = props;
  const [id, setId] = useState<string>();

  useEffect(() => {
    if (inputRef.current) setId(inputRef.current.id);
  }, [inputRef]);

  return <FieldLabel htmlFor={id}>{props.children}</FieldLabel>;
}
