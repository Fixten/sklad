import { cn } from "cn";

import Link from "../Link";

interface Props {
  className: string;
  navItems: {
    link: string;
    name: string;
  }[];
}

export default function Header(props: Props) {
  return (
    <header
      className={cn("flex items-center justify-between p-4", props.className)}
    >
      <span className="font-heading text-lg font-semibold tracking-wider uppercase">
        Sklad
      </span>
      <nav>
        <ul className="flex gap-8">
          {props.navItems.map(({ link, name }) => (
            <li key={link}>
              <Link
                to={link}
                className="text-muted-foreground hover:text-foreground text-xs font-semibold tracking-wide uppercase transition-colors"
              >
                {name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
