import Link from "../Link";
import styles from "./index.module.css";

type Props = {
  navItems: {
    link: string;
    name: string;
  }[];
};

export default function Header(props: Props) {
  return (
    <header className={styles.header}>
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
