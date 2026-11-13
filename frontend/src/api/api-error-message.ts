import { ErrorMessages } from "@/constants/Errors";

const userMessages: Record<string, string> = {
  [ErrorMessages.NAME_RESERVED_BY_HIDDEN]:
    "Скрыто, восстановите, чтобы продолжить.",
  [ErrorMessages.NAME_ALREADY_EXISTS]: "Такое имя уже занято.",
};

export const userMessage = (message: string) =>
  userMessages[message] ?? message;
