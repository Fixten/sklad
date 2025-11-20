import { Fragment, useState } from "react";

import userMaterialType from "../../features/Material/MaterialType/useMaterialType";
import Input from "ui/Input";
import Button from "ui/button";
import { BadgePlus, Check, Delete } from "lucide-react";
import Spinner from "ui/Spinner";
import Card from "ui/Card";
import Divider from "ui/Divider";

export default function MaterialTypePage() {
  const { query, addMutation, removeMutation } = userMaterialType();
  const [newItem, setNewItem] = useState<string>("");

  const onCreate: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (newItem) {
      await addMutation.mutateAsync(newItem);
      setNewItem("");
    }
  };

  function onChangeNewItem(val: string) {
    setNewItem(val);
    if (addMutation.isError || addMutation.isSuccess) addMutation.reset();
  }

  return (
    <section className="flex flex-col gap-8 max-w-10/12 mx-auto">
      <form className="flex items-end gap-8" onSubmit={onCreate}>
        <Input
          label="Добавить новый"
          error={addMutation.isError}
          value={newItem}
          onChange={onChangeNewItem}
        />
        {newItem && (
          <Button variant="outline" size="icon" type="submit">
            <BadgePlus />
          </Button>
        )}
        {addMutation.isSuccess && <Check />}
      </form>
      {query.isLoading ? (
        <Spinner />
      ) : (
        <Card.Wrapper>
          <ul>
            {query.data?.map((v, i, arr) => {
              const current = arr[arr.length - 1 - i];
              return (
                <Fragment key={current._id}>
                  <li className="p-2 flex items-center justify-between">
                    {current.name}{" "}
                    <Button
                      onClick={() => removeMutation.mutate(current._id)}
                      variant="outline"
                      size="icon"
                    >
                      <Delete />
                    </Button>
                  </li>
                  {i < arr.length - 1 && <Divider />}
                </Fragment>
              );
            })}
          </ul>
        </Card.Wrapper>
      )}
    </section>
  );
}
