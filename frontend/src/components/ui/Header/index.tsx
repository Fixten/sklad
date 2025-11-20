import clsx from "clsx";
import Link from "../Link";
import styles from "./index.module.css";

type Props = {
  className: string;
  navItems: {
    link: string;
    name: string;
  }[];
};

export default function Header(props: Props) {
  return (
    <header className={clsx(styles.header, props.className)}>
      Sklad
      <nav>
        <ul className={styles.list}>
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
