import useMaterialType from "./useMaterialType";

interface Props {
  id: number;
}

export default function MaterialTypeLabel(props: Props) {
  const { query } = useMaterialType();

  return query.data?.find((v) => props.id === v.id)?.name;
}
