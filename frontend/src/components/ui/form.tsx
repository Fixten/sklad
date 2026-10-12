import type { ComponentProps } from "react";
import type {
  FieldValues,
  SubmitHandler,
  UseFormReturn,
} from "react-hook-form";

type Props<TSchema extends FieldValues> = Omit<
  ComponentProps<"form">,
  "onSubmit"
> & {
  form: UseFormReturn<TSchema>;
  onSubmit: SubmitHandler<TSchema>;
};

function Form<TSchema extends FieldValues>({
  form,
  onSubmit,
  ...props
}: Props<TSchema>) {
  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <form
      data-slot="form"
      noValidate
      onSubmit={(event) => {
        void handleSubmit(event);
      }}
      {...props}
    />
  );
}

export { Form };
