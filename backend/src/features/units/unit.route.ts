import { Request, Router } from "express";
import { WithId } from "mongodb";

import { WithDb } from "@/db/WithDb.js";

import { UnitModel } from "./unit.model.js";
import unitService from "./unit.service.js";

const unitRouter = Router();

unitRouter.get("/", async (req, res) => {
  const result = await unitService.getAll();
  res.send(result);
});

unitRouter.post(
  "/",
  async (req: Request<void, WithId<WithDb<UnitModel>>, UnitModel>, res) => {
    const result = await unitService.addNew(req.body);
    res.send(result);
  }
);

export default unitRouter;
