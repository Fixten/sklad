import type { ReactNode } from "react";

import Typography from "@ui/Typography";

interface Props {
  message?: ReactNode;
}

export default function InlineError(props: Props) {
  if (props.message === undefined) {
    return null;
  }

  return (
    <Typography
      variant="body"
      role="alert"
      className="bg-destructive text-destructive-foreground w-fit max-w-full self-end px-2 py-1"
    >
      {props.message}
    </Typography>
  );
}
