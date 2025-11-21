import Button from "./Button";

interface Props {
  children: React.ReactNode;
  onClick: () => void;
}

export default function IconButton(props: Props) {
  return (
    <Button size="icon" variant="outline" onClick={props.onClick}>
      {props.children}
    </Button>
  );
}
