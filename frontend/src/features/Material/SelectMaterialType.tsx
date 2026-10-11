import { useId } from "react";

import Label from "ui/Label";

interface Props {
  value: string;
  onChange: (v: string) => void;
  error?: React.ReactNode;
  required?: boolean;
  label?: string;
}

export default function SelectMaterialType(props: Props) {
  const id = useId();
  return (
    <div className="grid w-full max-w-sm items-center gap-3">
      {props.label && <Label htmlFor={id}>{props.label}</Label>}
      {props.error}
    </div>
  );
}
