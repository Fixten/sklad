import { useState } from "react";

import { Button } from "@ui/Button";
import Typography from "@ui/Typography";

interface Props {
  isHidden: boolean;
  onDelete: () => void | Promise<void>;
  onRestore: () => void | Promise<void>;
  deleteBusy?: boolean;
  restoreBusy?: boolean;
}

export default function EntityActions(props: Props) {
  const [confirming, setConfirming] = useState(false);

  if (props.isHidden) {
    return (
      <div className="flex items-center gap-2 self-start">
        <Button
          onClick={() => void props.onRestore()}
          pending={props.restoreBusy}
        >
          Восстановить
        </Button>
      </div>
    );
  }

  if (confirming) {
    return (
      <div className="flex flex-col gap-2 self-start">
        <Typography variant="caption">
          Удалить? Если запись используется, она будет скрыта, а не удалена.
        </Typography>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              setConfirming(false);
              void props.onDelete();
            }}
            pending={props.deleteBusy}
            variant="destructive"
          >
            Да
          </Button>
          <Button onClick={() => setConfirming(false)} variant="outline">
            Отмена
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 self-start">
      <Button onClick={() => setConfirming(true)} variant="destructive">
        Удалить
      </Button>
    </div>
  );
}
