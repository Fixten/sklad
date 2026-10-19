import { cn } from "cn";
import { Link as RouterLink, NavLink as RouterNavLink } from "react-router";

const linkClassName =
  "text-foreground underline decoration-primary underline-offset-4 transition-colors hover:text-primary";

const navLinkClassName =
  "type-label text-muted-foreground whitespace-nowrap transition-colors hover:text-foreground aria-[current=page]:text-foreground";

const focusClassName = "focus-visible:outline-2 focus-visible:outline-offset-2";

interface LinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

interface NavLinkProps extends LinkProps {
  end?: boolean;
}

export function Link({ to, children, className }: LinkProps) {
  return (
    <RouterLink
      to={to}
      className={cn(linkClassName, focusClassName, className)}
    >
      {children}
    </RouterLink>
  );
}

export function NavLink({ to, children, className, end }: NavLinkProps) {
  return (
    <RouterNavLink
      to={to}
      className={cn(navLinkClassName, focusClassName, className)}
      end={end}
    >
      {children}
    </RouterNavLink>
  );
}
