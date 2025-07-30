import { DataModel, DataSource } from "@toolpad/core";
import { Card, CardContent, CardHeader, TextField } from "@mui/material";

import SettingsApi from "./Settings.api";
import { useState } from "react";

interface SettingsData extends DataModel {
  name: string;
  value: number;
}

export default function SettingsPage() {
  const [value, setValue] = useState<number>(
    async () => (await SettingsApi.getAll()).work_hour_cost
  );
  return (
    <Card>
      <CardHeader title="Цена работы в час"></CardHeader>
      <CardContent>
        <TextField type="number" defaultValue={value} />
      </CardContent>
    </Card>
  );
}
