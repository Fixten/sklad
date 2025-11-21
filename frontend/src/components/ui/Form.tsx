interface Props {
  onSubmit: () => Promise<unknown>;
  children: React.ReactNode;
  className?: string;
}

export default function Form(props: Props) {
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    props.onSubmit().catch(console.error);
  }
  return (
    <form onSubmit={onSubmit} className={props.className}>
      {props.children}
    </form>
  );
}
