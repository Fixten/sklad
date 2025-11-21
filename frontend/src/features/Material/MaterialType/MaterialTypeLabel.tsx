import useMaterialType from "./useMaterialType";

interface Props {
  id: string;
}

export default function MaterialTypeLabel(props: Props) {
  const { query } = useMaterialType();

  return query.data?.find((v) => props.id === v._id)?.name;
}
