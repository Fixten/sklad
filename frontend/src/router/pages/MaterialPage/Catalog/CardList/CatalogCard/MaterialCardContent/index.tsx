import type { MaterialTypeModel } from "@/features/MaterialType/MaterialType.model";
import type { VariantModel } from "@/features/Variant/Variant.model";
import Typography from "@ui/Typography";

import HiddenMessage from "../../../../HiddenMessage";
import summarizeNames from "../summarizeNames";

interface Props {
  type?: MaterialTypeModel;
  variants: VariantModel[];
  hidden?: boolean;
}

export default function MaterialCardContent(props: Props) {
  const names = props.variants.map((variant) => variant.name);
  const summary = summarizeNames(names);

  return (
    <>
      {props.hidden ? <HiddenMessage /> : null}
      {props.type ? (
        <Typography variant="caption">{props.type.name}</Typography>
      ) : null}
      <Typography variant="caption">
        Варианты: {props.variants.length}
      </Typography>
      {summary ? <Typography variant="caption">{summary}</Typography> : null}
    </>
  );
}
