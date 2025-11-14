import { Typography, CircularProgress, Stack } from "@mui/material";
import useMaterial from "./useMaterial";
import MaterialItem from "../../features/Material/MaterialItem";
import AddMaterial from "../../features/Material/AddMaterial";

export default function MaterialPage() {
  const { query, addMutation, updateMutation, removeMutation } = useMaterial();
  const allMaterial = query.data?.length ? (
    query.data.map((v) => <MaterialItem value={v} />)
  ) : (
    <Typography>Пусто!</Typography>
  );

  if (query.isLoading) return <CircularProgress />;
  else
    return (
      <Stack spacing={2} useFlexGap>
        <AddMaterial
          onSubmit={addMutation.mutate}
          isError={addMutation.isError}
        />
        {allMaterial}
      </Stack>
    );
}
