import { Request, Router } from "express";

import materialVariantRouter from "../materialVariant/materialVariant.router.js";

import { MaterialModel, MaterialSchema } from "./material.schema.js";
import { MaterialService } from "./material.service.js";

const materialRouter = Router();
materialRouter.use("/variant", materialVariantRouter);
const service = MaterialService.getSingleton();

materialRouter.get("/", async (req, res) => {
  res.send(await service.getAll());
});

materialRouter.post(
  "/",
  async (req: Request<void, MaterialSchema, MaterialModel>, res) => {
    res.send(await service.create(req.body));
  },
);

materialRouter.post(
  "/:id",
  async (req: Request<{ id: number }, MaterialSchema, MaterialModel>, res) => {
    res.send(await service.updateMaterial(req.params.id, req.body));
  },
);

materialRouter.delete("/:id", async (req: Request<{ id: number }>, res) => {
  await service.deleteMaterial(req.params.id);
  res.send({ message: `${String(req.params.id)} deleted` });
});

export default materialRouter;
