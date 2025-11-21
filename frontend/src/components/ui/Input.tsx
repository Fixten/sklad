import { useId } from "react";

import { cn } from "@/utils/cn";

import Label from "./Label";

interface Props {
  error?: React.ReactNode;
  label?: React.ReactNode;
  onChange?: (value: string) => void;
  type?: React.HTMLInputTypeAttribute;
  value?: React.InputHTMLAttributes<HTMLInputElement>["value"];
  defaultValue?: React.InputHTMLAttributes<HTMLInputElement>["defaultValue"];
  onBlur?: (v: string) => void;
  required?: boolean;
}

export default function Input({ type = "text", ...props }: Props) {
  const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    props.onChange?.(e.target.value);
  };
  const id = useId();
  return (
    <div className="grid w-full max-w-sm items-center gap-3">
      {props.label && <Label htmlFor={id}>{props.label}</Label>}
      <input
        onChange={props.onChange && onChange}
        defaultValue={props.defaultValue}
        value={props.value}
        type={type}
        id={id}
        data-slot="input"
        onBlur={props.onBlur && ((e) => props.onBlur?.(e.target.value))}
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          props.error && "text-destructive-foreground"
        )}
        required={props.required}
      />
      {props.error}
    </div>
  );
}
