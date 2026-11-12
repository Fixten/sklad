import useMaterialType from "./useMaterialType";

interface Props {
  id: number;
}

export default function MaterialTypeLabel(props: Props) {
  const { types } = useMaterialType();

  return types.find((v) => props.id === v.id)?.name;
}
