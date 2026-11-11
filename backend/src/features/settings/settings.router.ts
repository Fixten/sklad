import { Request, Router } from "express";

import { sendSpec, validateBody } from "@/openapi/validation.js";

import { SettingsModel, SettingsSchema } from "./settings.schema.js";
import SettingsService from "./settings.service.js";
import { settingsBodyZ, settingsGetZ, settingsRowZ } from "./settings.zod.js";

const settingsRouter = Router();

const service = SettingsService.getSingleton();

const sendGet = sendSpec(settingsGetZ);
const sendRow = sendSpec(settingsRowZ);

settingsRouter.get("/", (req, res) => {
  sendGet(res, service.getConfig());
});

settingsRouter.post(
  "/",
  validateBody(settingsBodyZ),
  (
    req: Request<Record<string, string>, SettingsSchema, SettingsModel>,
    res,
  ) => {
    sendRow(res, service.updateConfig(req.body));
  },
);

export default settingsRouter;
