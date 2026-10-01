interface Props {
  onSubmit: () => unknown;
  children: React.ReactNode;
  className?: string;
}

export default function Form(props: Props) {
  function onSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    try {
      props.onSubmit();
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <form onSubmit={onSubmit} className={props.className}>
      {props.children}
    </form>
  );
}
