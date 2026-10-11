import { cn } from "@/utils/cn";

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
    <header className={cn("flex justify-between p-4", props.className)}>
      Sklad
      <nav>
        <ul className="flex gap-8">
          {props.navItems.map(({ link, name }) => (
            <li key={link}>
              <Link to={link}>{name}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
