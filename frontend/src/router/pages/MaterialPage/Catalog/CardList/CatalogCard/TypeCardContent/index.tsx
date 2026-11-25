import type { MaterialModel } from "@/features/Material/Material.model";
import Typography from "@ui/Typography";

import summarizeNames from "../summarizeNames";

interface Props {
  materials: MaterialModel[];
}

export default function TypeCardContent(props: Props) {
  const names = props.materials.map((material) => material.name);
  const summary = summarizeNames(names);

  return (
    <>
      <Typography variant="caption">
        Материалы: {props.materials.length}
      </Typography>
      {summary ? <Typography variant="caption">{summary}</Typography> : null}
    </>
  );
}
