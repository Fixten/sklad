import type { MaterialModel } from "@/features/Material/Material.model";
import Typography from "@ui/Typography";

import HiddenMessage from "../../../HiddenMessage";
import summarizeNames from "../summarizeNames";

interface Props {
  materials: MaterialModel[];
  hidden?: boolean;
}

export default function TypeCardContent(props: Props) {
  const names = props.materials.map((material) => material.name);
  const summary = summarizeNames(names);

  return (
    <>
      {props.hidden ? <HiddenMessage /> : null}
      <Typography variant="caption">
        Материалы: {props.materials.length}
      </Typography>
      {summary ? <Typography variant="caption">{summary}</Typography> : null}
    </>
  );
}
