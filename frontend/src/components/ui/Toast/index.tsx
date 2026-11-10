import type { ComponentProps, ReactNode } from "react";

import { Toaster as BaseToaster, toast } from "@base/toast";

type ToasterProps = ComponentProps<typeof BaseToaster>;

export default function Toaster(props: ToasterProps) {
  return <BaseToaster {...props} />;
}

export function toastSuccess(title: ReactNode, description?: ReactNode) {
  return toast.add({ title, description, type: "success" });
}

export function toastError(title: ReactNode, description?: ReactNode) {
  return toast.add({ title, description, type: "error" });
}
