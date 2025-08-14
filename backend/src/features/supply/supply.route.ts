import { Request, Router } from "express";
import { WithId } from "mongodb";

import { WithDb } from "@/db/WithDb.js";

import { SupplyModel } from "./supply.model.js";
import supplyService from "./supply.service.js";

const supplyRouter = Router();

// delete

supplyRouter.get("/", async (req, res) => {
  res.send(await supplyService.getAll());
});

supplyRouter.post(
  "/",
  async (req: Request<void, WithId<WithDb<SupplyModel>>, SupplyModel>, res) => {
    res.send(await supplyService.addNew(req.body));
  }
);

supplyRouter.post(
  "/:id",
  async (
    req: Request<{ id: string }, WithId<WithDb<SupplyModel>>, SupplyModel>,
    res
  ) => {
    res.send(await supplyService.update(req.params.id, req.body));
  }
);

supplyRouter.delete(
  "/:id",
  async (req: Request<{ id: string }, boolean>, res) => {
    res.send(await supplyService.delete(req.params.id));
  }
);

export default supplyRouter;
