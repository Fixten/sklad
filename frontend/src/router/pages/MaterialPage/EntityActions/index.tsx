import { useState } from "react";

import { CheckIcon, RotateCcwIcon, Trash2Icon, XIcon } from "@ui/Icon";
import IconButton from "@ui/IconButton";
import Popover from "@ui/Popover";
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
  let content: React.ReactNode;

  switch (true) {
    case props.isHidden:
      content = (
        <IconButton
          aria-label="Восстановить"
          title="Восстановить"
          onClick={() => void props.onRestore()}
          pending={props.restoreBusy}
        >
          <RotateCcwIcon aria-hidden="true" />
        </IconButton>
      );
      break;
    default:
      content = (
        <Popover
          open={confirming}
          onOpenChange={setConfirming}
          trigger={
            <IconButton aria-label="Удалить" title="Удалить">
              <Trash2Icon aria-hidden="true" />
            </IconButton>
          }
        >
          <Typography variant="caption" className="text-muted-foreground">
            Удалить? Если запись используется, она будет скрыта, а не удалена.
          </Typography>
          <div className="flex items-center gap-2">
            <IconButton
              aria-label="Да"
              title="Да"
              onClick={() => {
                setConfirming(false);
                void props.onDelete();
              }}
              pending={props.deleteBusy}
              variant="destructive"
            >
              <CheckIcon aria-hidden="true" />
            </IconButton>
            <IconButton
              aria-label="Отмена"
              title="Отмена"
              onClick={() => setConfirming(false)}
            >
              <XIcon aria-hidden="true" />
            </IconButton>
          </div>
        </Popover>
      );
  }

  return <div className="flex items-center gap-2 self-start">{content}</div>;
}
