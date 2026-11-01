import {
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@base/field";

import type { ComponentProps, ReactNode } from "react";

interface InputFieldGroupProps extends Omit<
  ComponentProps<"fieldset">,
  "children"
> {
  label: string;
  description?: ReactNode;
  children: ReactNode;
}

export default function InputFieldGroup({
  label,
  description,
  children,
  className,
  ...props
}: InputFieldGroupProps) {
  return (
    <FieldSet {...props} className={className}>
      <FieldLegend className="text-muted-foreground mb-0">{label}</FieldLegend>
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      <FieldGroup className="gap-6">{children}</FieldGroup>
    </FieldSet>
  );
}

export type { InputFieldGroupProps };
