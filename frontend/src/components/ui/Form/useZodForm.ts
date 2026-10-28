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

function useZodForm<TSchema extends FormSchema>({
  schema,
  mode = "onSubmit",
  reValidateMode = "onChange",
  ...props
}: UseZodFormProps<TSchema>): UseFormReturn<
  z.input<TSchema>,
  unknown,
  z.output<TSchema>
> {
  const resolver = zodResolver(schema) as unknown as Resolver<
    z.input<TSchema>,
    unknown,
    z.output<TSchema>
  >;

  return useForm<z.input<TSchema>, unknown, z.output<TSchema>>({
    mode,
    reValidateMode,
    ...props,
    resolver,
  });
}

export { useZodForm };
export type { UseZodFormProps };
