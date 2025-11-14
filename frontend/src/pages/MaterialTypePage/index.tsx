import {
  Card,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
} from "@mui/material";
import { Fragment, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircle from "@mui/icons-material/AddCircleOutlineTwoTone";
import CheckIcon from "@mui/icons-material/Check";

import userMaterialType from "../../features/Material/MaterialType/useMaterialType";

export default function MaterialTypePage() {
  const { query, addMutation, removeMutation } = userMaterialType();
  const [newItem, setNewItem] = useState<string>("");

  async function onCreate() {
    if (newItem) {
      await addMutation.mutateAsync(newItem);
      setNewItem("");
    }
  }

  function onChangeNewItem(
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>
  ) {
    setNewItem(e.currentTarget.value);
    if (addMutation.isError || addMutation.isSuccess) addMutation.reset();
  }

  return (
    <Stack useFlexGap spacing={2}>
      <Grid container direction="row" alignItems="center" gap={2}>
        <TextField
          label="Добавить новый"
          error={addMutation.isError}
          value={newItem}
          onChange={onChangeNewItem}
        />
        {newItem && (
          <IconButton onClick={onCreate}>
            <AddCircle />
          </IconButton>
        )}
        {addMutation.isSuccess && <CheckIcon color="success" />}
      </Grid>
      {query.isLoading ? (
        <CircularProgress />
      ) : (
        <Card>
          <List>
            {query.data?.map((v, i, arr) => {
              const current = arr[arr.length - 1 - i];
              return (
                <Fragment key={current._id}>
                  <ListItem
                    secondaryAction={
                      <IconButton
                        onClick={() => removeMutation.mutate(current._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText>{current.name}</ListItemText>
                  </ListItem>
                  {i < arr.length - 1 && <Divider />}
                </Fragment>
              );
            })}
          </List>
        </Card>
      )}
    </Stack>
  );
}
