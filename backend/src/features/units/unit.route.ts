import { Request, Router } from "express";
import { WithId } from "mongodb";

import { WithDb } from "@/db/WithDb.js";

import { UnitModel } from "./unit.model.js";
import unitService from "./unit.service.js";

const unitRouter = Router();

unitRouter.get("/", async (_, res) => {
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

unitRouter.delete(
  "/:id",
  async (req: Request<{ id: string }, { message: string }>, res) => {
    await unitService.delete(req.params.id);
    res.send({ message: `${req.params.id} deleted` });
  }
);

export default unitRouter;
