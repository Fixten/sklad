import { Request, Router } from "express";

import { SupplyModel, SupplySchema } from "./supply.schema.js";
import supplyService from "./supply.service.js";

const supplyRouter = Router();

const service = supplyService.getSingleton();

supplyRouter.get("/", async (req, res) => {
  res.send(await service.getAll());
});

supplyRouter.post(
  "/",
  async (req: Request<void, SupplySchema, SupplyModel>, res) => {
    res.send(await service.create(req.body));
  },
);

supplyRouter.post(
  "/:id",
  async (req: Request<{ id: number }, SupplySchema, SupplyModel>, res) => {
    const result = await service.update(req.params.id, req.body);
    res.send(result);
  },
);

supplyRouter.delete(
  "/:id",
  async (req: Request<{ id: number }, boolean>, res) => {
    res.send(await service.hardDelete(req.params.id));
  },
);

export default supplyRouter;
