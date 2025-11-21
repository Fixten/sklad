import { Link } from "react-router";

interface Props {
  to: string;
  children: React.ReactNode;
  className?: string;
}

export default function (props: Props) {
  return (
    <Link to={props.to} className={props.className}>
      {props.children}
    </Link>
  );
}
