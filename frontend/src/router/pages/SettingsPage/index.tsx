import { Check } from "lucide-react";
import { useState } from "react";

import useSettings from "@/features/Settings/useSettings";
import { Card, CardContent, CardHeader, CardTitle } from "@base/card";
import { Field } from "@base/field";
import { Input } from "@base/input";
import { Spinner } from "@base/spinner";

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
    <Card>
      <CardHeader>
        <CardTitle>Цена работы в час</CardTitle>
      </CardHeader>
      <CardContent>
        {query.isLoading ? (
          <Spinner />
        ) : (
          <div className="flex gap-2">
            <Field data-invalid={isError || undefined} className="max-w-sm">
              <Input
                defaultValue={query.data?.work_hour_cost}
                aria-invalid={isError || undefined}
                onBlur={(e) => {
                  onChange(e.target.value);
                }}
                onChange={mutation.reset}
              />
            </Field>
            {mutation.isSuccess && <Check />}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
