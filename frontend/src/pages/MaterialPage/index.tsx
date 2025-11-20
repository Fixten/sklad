import useMaterial from "./useMaterial";
import MaterialItem from "../../features/Material/MaterialItem";
import AddMaterial from "../../features/Material/AddMaterial";
import Spinner from "ui/Spinner";

export default function MaterialPage() {
  const { query, addMutation, updateMutation, removeMutation } = useMaterial();
  const allMaterial = query.data?.length
    ? query.data.map((v) => <MaterialItem key={v._id} value={v} />)
    : "Пусто!";

  if (query.isLoading) return <Spinner />;
  else
    return (
      <section className="flex flex-col gap-8 max-w-4xl mx-auto">
        <AddMaterial
          onSubmit={addMutation.mutate}
          isError={addMutation.isError}
        />
        {allMaterial}
      </section>
    );
}
