import useMaterial from "./useMaterial";
import MaterialItem from "../../features/Material/MaterialItem";
import EditMaterial from "../../features/Material/EditMaterial";
import Spinner from "ui/Spinner";
import { useState } from "react";
import { MaterialDTO } from "@/features/Material/Material.model";
import AddMaterial from "@/features/Material/AddMaterial";

export default function MaterialPage() {
  const { query, addMutation, updateMutation, removeMutation } = useMaterial();
  const [editItem, setEditItem] = useState<string>();

  async function onEdit(id: string, v: MaterialDTO) {
    await updateMutation.mutateAsync({ ...v, _id: id });
    setEditItem("");
  }

  const allMaterial = query.data?.length
    ? query.data.map((_, i, arr) => {
        const current = arr[arr.length - 1 - i];

        return editItem === current._id ? (
          <EditMaterial
            value={current}
            onSubmit={(newValue) => onEdit(current._id, newValue)}
            isError={updateMutation.isError}
          />
        ) : (
          <MaterialItem
            onChange={() => setEditItem(current._id)}
            key={current._id}
            value={current}
            onRemove={() => removeMutation.mutate(current._id)}
          />
        );
      })
    : "Пусто!";

  if (query.isLoading) return <Spinner />;
  else
    return (
      <section className="flex flex-col gap-8">
        <AddMaterial
          onSubmit={addMutation.mutate}
          isError={addMutation.isError}
        />
        {allMaterial}
      </section>
    );
}
