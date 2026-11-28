import type { ReactNode } from "react";

import {
  Card as BaseCard,
  CardAction,
  CardContent,
  CardHeader,
} from "@base/card";
import Link from "@ui/Link";
import Typography from "@ui/Typography";

interface Props {
  title: string;
  titleTo?: string;
  description?: string;
  action?: ReactNode;
  children?: ReactNode;
}

export default function Card(props: Props) {
  return (
    <BaseCard>
      <CardHeader>
        <Typography variant="title">
          {props.titleTo ? (
            <Link
              to={props.titleTo}
              unstyled
              className="focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {props.title}
            </Link>
          ) : (
            props.title
          )}
        </Typography>
        {props.description ? (
          <Typography className="text-muted-foreground">
            {props.description}
          </Typography>
        ) : null}
        {props.action ? <CardAction>{props.action}</CardAction> : null}
      </CardHeader>
      {props.children ? <CardContent>{props.children}</CardContent> : null}
    </BaseCard>
  );
}

export type { Props as CardProps };
