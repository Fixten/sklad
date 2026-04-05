import { Request, Router } from "express";

import supplyService from "./supply.service.js";
import { SupplyModel, SupplySchema } from "./supply.schema.js";

const supplyRouter = Router();

supplyRouter.get("/", async (req, res) => {
  res.send(await supplyService.getAll());
});

supplyRouter.post(
  "/",
  async (req: Request<void, SupplySchema, SupplyModel>, res) => {
    res.send(await supplyService.addNew(req.body));
  },
);

supplyRouter.post(
  "/:id",
  async (req: Request<{ id: number }, SupplySchema, SupplyModel>, res) => {
    const result = await supplyService.update(req.params.id, req.body);
    res.send(result);
  },
);

supplyRouter.delete(
  "/:id",
  async (req: Request<{ id: number }, boolean>, res) => {
    res.send(await supplyService.delete(req.params.id));
  },
);

export default supplyRouter;
