export enum ErrorMessages {
  BACKEND_PORT_NOT_SET = "BACKEND_PORT is not set",
  NO_SQLITE_PATH_IN_ENV = "No sqlite path string in env",
  ITEM_NOT_FOUND = "Item was not found",
  ITEM_TO_DELETE_NOT_FOUND = "Item to delete was not found",
  DB_OPERATION_FAILED = "Db operation failed",
  UNIT_CHANGE_AFTER_USAGE = "Unit cannot be changed after historical usage",
  WRONG_UNIT = "Wrong unit",
  INTERNAL_SERVER_ERROR = "Internal server error",
}