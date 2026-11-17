import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type {
  FieldValues,
  Resolver,
  UseFormProps,
  UseFormReturn,
} from "react-hook-form";
import type * as z from "zod";

type FormSchema = z.ZodType<FieldValues, FieldValues>;

type UseZodFormProps<TSchema extends FormSchema> = Omit<
  UseFormProps<z.input<TSchema>, unknown, z.output<TSchema>>,
  "resolver"
> & {
  schema: TSchema;
};

interface RootError {
  message?: string;
  set: (message: string) => void;
  clear: () => void;
}

interface RootErrorProps {
  rootError: RootError;
}

function useZodForm<TSchema extends FormSchema>({
  schema,
  mode = "onSubmit",
  reValidateMode = "onChange",
  ...props
}: UseZodFormProps<TSchema>): UseFormReturn<
  z.input<TSchema>,
  unknown,
  z.output<TSchema>
> &
  RootErrorProps {
  const resolver = zodResolver(schema) as unknown as Resolver<
    z.input<TSchema>,
    unknown,
    z.output<TSchema>
  >;
  const form = useForm<z.input<TSchema>, unknown, z.output<TSchema>>({
    mode,
    reValidateMode,
    ...props,
    resolver,
  });
  return {
    ...form,
    rootError: {
      message: form.formState.errors.root?.message,
      set: (message) => {
        form.setError("root", { type: "submit", message });
      },
      clear: () => {
        form.clearErrors("root");
      },
    },
  };
}

export { useZodForm };
export type { UseZodFormProps };
