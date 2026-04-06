import { Request, Router } from "express";

import variantRouter from "../materialVariant/materialVariant.router.js";
import { MaterialService } from "./material.service.js";
import { MaterialModel, MaterialSchema } from "./material.schema.js";

const materialRouter = Router();
materialRouter.use("/variant", variantRouter);
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
  res.send({ message: `${req.params.id} deleted` });
});

export default materialRouter;
