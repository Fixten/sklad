import Select from "@/components/ui/select";
import userMaterialType from "./MaterialType/useMaterialType";

type Props = {
  value: string;
  onChange: (v: string) => void;
  isError: boolean;
};

export default function SelectMaterialType(props: Props) {
  const { query } = userMaterialType();
  return (
    <Select
      options={
        query.data?.map((v) => ({
          value: v._id,
          label: v.name,
          id: v._id,
        })) || []
      }
      label="Тип материала"
    />
  );
}
