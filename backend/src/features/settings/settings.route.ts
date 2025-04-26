import { Request, Router } from "express";
import { WithId } from "mongodb";

import { WithDb } from "db/CreateAndUpdateRepository/WithDb.js";

import { SettingsModel } from "./settings.model.js";
import settingsService from "./settings.service.js";

const settingsRouter = Router();

settingsRouter.get("/", async (req, res) => {
  res.send(await settingsService.getConfig());
});
settingsRouter.post(
  "/",
  async (
    req: Request<void, WithId<WithDb<SettingsModel>> | null, SettingsModel>,
    res
  ) => {
    res.send(await settingsService.update(req.body));
  }
);

export default settingsRouter;
