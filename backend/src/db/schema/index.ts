import {
  settingsSchema,
  settingsTable,
} from "@/features/settings/settings.schema.js";

const shemas = {
  [settingsTable]: settingsSchema,
};

export default shemas;
