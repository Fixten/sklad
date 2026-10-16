import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

const variantClassNames = {
  display: "type-display",
  title: "type-title",
  label: "type-label",
  body: "type-body",
  caption: "type-caption",
  data: "type-data",
} as const;

type Variant = keyof typeof variantClassNames;

const defaultVariant: Variant = "body";

const typographyVariants = cva("", {
  variants: {
    variant: variantClassNames,
  },
  defaultVariants: {
    variant: defaultVariant,
  },
});

const defaultTagNames: Record<Variant, React.ElementType> = {
  display: "h1",
  title: "h2",
  label: "span",
  body: "p",
  caption: "p",
  data: "span",
};

type Props<T extends React.ElementType> = VariantProps<
  typeof typographyVariants
> & {
  tagName?: T;
  className?: string;
} & Omit<React.ComponentPropsWithoutRef<T>, "className" | "tagName">;

export default function Typography<T extends React.ElementType = "p">(
  props: Props<T>,
) {
  const { variant, tagName, className, ...rest } = props;
  const resolvedVariant = variant ?? defaultVariant;
  const Tag = tagName ?? defaultTagNames[resolvedVariant];

  return (
    <Tag
      className={cn(
        typographyVariants({ variant: resolvedVariant }),
        className,
      )}
      {...rest}
    />
  );
}
