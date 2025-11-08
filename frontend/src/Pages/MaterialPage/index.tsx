import { Typography, CircularProgress } from "@mui/material";
import useMaterial from "./useMaterial";
import MaterialItem from "./MaterialItem";

export default function MaterialPage() {
  const { query, addMutation, updateMutation, removeMutation } = useMaterial();
  if (query.isLoading) return <CircularProgress />;
  else if (query.data?.length)
    return query.data.map((v) => <MaterialItem value={v} />);
  else return <Typography>Пусто!</Typography>;
}
