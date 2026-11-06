import { cn } from "cn";
import type { ReactNode } from "react";

import Link from "@ui/Link";
import Typography from "@ui/Typography";

interface PageLayoutProps {
  back?: { to: string; label: string };
  title: string;
  className?: string;
  children: ReactNode;
}

export default function PageLayout({
  back,
  title,
  className,
  children,
}: PageLayoutProps) {
  return (
    <div className={cn("flex max-w-2xl flex-col gap-6", className)}>
      {back ? (
        <Link
          to={back.to}
          unstyled
          className="type-label text-muted-foreground hover:text-foreground w-fit focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {`← ${back.label}`}
        </Link>
      ) : null}
      <Typography variant="display">{title}</Typography>
      {children}
    </div>
  );
}

export type { PageLayoutProps };
