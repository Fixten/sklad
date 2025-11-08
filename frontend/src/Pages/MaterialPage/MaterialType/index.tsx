import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
} from "@mui/material";
import { Fragment, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircle from "@mui/icons-material/AddCircleOutlineTwoTone";
import CheckIcon from "@mui/icons-material/Check";

import userMaterialType from "./useMaterialType";

export default function MaterialType() {
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
    <Card>
      <CardHeader title="Тип материалов"></CardHeader>
      <CardContent>
        {query.isLoading ? (
          <CircularProgress />
        ) : (
          <List>
            {query.data?.map((v, i, arr) => (
              <Fragment key={`${v}:${i}`}>
                <ListItem
                  secondaryAction={
                    <IconButton onClick={() => removeMutation.mutate(v._id)}>
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText>{v.name}</ListItemText>
                </ListItem>
                {i < arr.length - 1 && <Divider />}
              </Fragment>
            ))}
          </List>
        )}
        <CardActions>
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
        </CardActions>
      </CardContent>
    </Card>
  );
}
