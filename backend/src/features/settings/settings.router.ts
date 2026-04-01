import { Request, Router } from "express";

import settingsRepository from "./settings.repository.js";
import { SettingsModel, SettingsSchema } from "./settings.schema.js";

const settingsRouter = Router();

settingsRouter.get("/", async (req, res) => {
  res.send(await settingsRepository.getConfig());
});

settingsRouter.post(
  "/",
  async (req: Request<void, SettingsSchema, SettingsModel>, res) => {
    const result = await settingsRepository.updateConfig(req.body);
    res.send(result);
  },
);

export default settingsRouter;
