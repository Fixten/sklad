import { Request, Router } from "express";

import { sendSpec, validateBody } from "@/openapi/validation.js";

import SettingsRepository from "./settings.repository.js";
import { SettingsModel, SettingsSchema } from "./settings.schema.js";
import { settingsBodyZ, settingsGetZ, settingsRowZ } from "./settings.zod.js";

const settingsRouter = Router();

const service = SettingsRepository.getSingleton();

const sendGet = sendSpec(settingsGetZ);
const sendRow = sendSpec(settingsRowZ);

settingsRouter.get("/", async (req, res) => {
  sendGet(res, await service.getConfig());
});

settingsRouter.post(
  "/",
  validateBody(settingsBodyZ),
  async (req: Request<Record<string, string>, SettingsSchema, SettingsModel>, res) => {
    sendRow(res, await service.updateConfig(req.body));
  },
);

export default settingsRouter;