import { useId } from "react";

import Label from "ui/Label";
import Select from "ui/Select";

import useMaterialType from "./MaterialType/useMaterialType";

interface Props {
  value: string;
  onChange: (v: string) => void;
  error?: React.ReactNode;
  required?: boolean;
  label?: string;
}

export default function SelectMaterialType(props: Props) {
  const { query } = useMaterialType();
  const id = useId();
  return (
    <div className="grid w-full max-w-sm items-center gap-3">
      {props.label && <Label htmlFor={id}>{props.label}</Label>}
      <Select
        value={props.value}
        onChange={props.onChange}
        required={props.required}
        options={
          query.data?.map((v) => ({
            value: v._id,
            label: v.name,
            id: v._id,
          })) ?? []
        }
        label="Тип материала"
      />
      {props.error}
    </div>
  );
}
