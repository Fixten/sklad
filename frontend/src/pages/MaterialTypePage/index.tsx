import { BadgePlus, Check, Delete } from "lucide-react";
import { Fragment, useState } from "react";

import Button from "ui/Button";
import Card from "ui/Card";
import Divider from "ui/Divider";
import Input from "ui/Input";
import Spinner from "ui/Spinner";

import useMaterialType from "../../features/Material/MaterialType/useMaterialType";

export default function MaterialTypePage() {
  const { query, addMutation, removeMutation } = useMaterialType();
  const [newItem, setNewItem] = useState<string>("");

  const onCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newItem) {
      addMutation.mutateAsync(newItem).then(() => {
        setNewItem("");
      }, console.error);
    }
  };

  function onChangeNewItem(val: string) {
    setNewItem(val);
    if (addMutation.isError || addMutation.isSuccess) addMutation.reset();
  }

  return (
    <section className="flex flex-col gap-8">
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
                      onClick={() => {
                        removeMutation.mutate(current._id);
                      }}
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
