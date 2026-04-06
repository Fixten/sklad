import { Request, Router } from "express";

import SettingsRepository from "./settings.repository.js";
import { SettingsModel, SettingsSchema } from "./settings.schema.js";

const settingsRouter = Router();

const service = SettingsRepository.getSingleton();

settingsRouter.get("/", async (req, res) => {
  res.send(await service.getConfig());
});

settingsRouter.post(
  "/",
  async (req: Request<void, SettingsSchema, SettingsModel>, res) => {
    const result = await service.updateConfig(req.body);
    res.send(result);
  },
);

export default settingsRouter;
