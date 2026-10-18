import { Link as RouterLink, NavLink as RouterNavLink } from "react-router";

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
    <RouterLink to={to} className={className}>
      {children}
    </RouterLink>
  );
}

export function NavLink({ to, children, className, end }: NavLinkProps) {
  return (
    <RouterNavLink to={to} className={className} end={end}>
      {children}
    </RouterNavLink>
  );
}
