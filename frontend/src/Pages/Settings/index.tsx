import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  CircularProgress,
  Avatar,
  Box,
} from "@mui/material";
import { useState } from "react";
import CheckIcon from "@mui/icons-material/Check";

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
    <Card>
      <CardHeader title="Цена работы в час"></CardHeader>
      <CardContent>
        {query.isLoading ? (
          <CircularProgress />
        ) : (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <TextField
              error={isError}
              defaultValue={query.data?.work_hour_cost}
              onBlur={(e) => onChange(e.currentTarget.value)}
              onChange={mutation.reset}
            />
            {mutation.isSuccess && (
              <Avatar>
                <CheckIcon color="success" />
              </Avatar>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
