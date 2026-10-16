import { cn } from "cn";

import Link from "../Link";
import Typography from "../Typography";

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
      <Typography variant="title" tagName="span">
        Sklad
      </Typography>
      <nav>
        <ul className="flex gap-8">
          {props.navItems.map(({ link, name }) => (
            <li key={link}>
              <Typography
                tagName={Link}
                to={link}
                variant="label"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {name}
              </Typography>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
