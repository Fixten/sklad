import { Check } from "lucide-react";
import { useState } from "react";

import Card from "ui/Card";
import Input from "ui/Input";
import Spinner from "ui/Spinner";

import useSettings from "./useSettings";

export default function SettingsPage() {
  const { query, mutation } = useSettings();
  const [isError, setIsError] = useState<boolean>(false);
  const onChange = (value: string) => {
    const numbered = Number(value);
    if (isNaN(numbered)) setIsError(true);
    else {
      setIsError(false);
      mutation.mutate(numbered);
    }
  };
  return (
    <Card.Wrapper>
      <Card.CardHeader>
        <Card.CardTitle>Цена работы в час</Card.CardTitle>
      </Card.CardHeader>
      <Card.CardContent>
        {query.isLoading ? (
          <Spinner />
        ) : (
          <div className="flex gap-2">
            <Input
              error={isError}
              defaultValue={query.data?.work_hour_cost}
              onBlur={onChange}
              onChange={mutation.reset}
            />
            {mutation.isSuccess && <Check />}
          </div>
        )}
      </Card.CardContent>
    </Card.Wrapper>
  );
}
