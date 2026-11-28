import { Button, type ButtonProps } from "@ui/Button";

interface Props extends Omit<
  ButtonProps,
  "size" | "children" | "pendingLabel"
> {
  children: React.ReactNode;
}

export default function IconButton(props: Props) {
  return (
    <Button {...props} size="icon" variant={props.variant ?? "outline"}>
      {props.pending ? null : props.children}
    </Button>
  );
}
