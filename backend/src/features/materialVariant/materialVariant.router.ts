import { Request, Router } from "express";

import { MaterialVariantModel } from "./materialVariant.schema.js";
import { MaterialVariantService } from "./materialVariant.service.js";

const materialVariantRouter = Router();

const service = MaterialVariantService.getSingleton();

materialVariantRouter.get("/", async (req, res) => {
  res.send(await service.getAll());
});

materialVariantRouter.get("/:id", async (req: Request<{ id: number }>, res) => {
  res.send(await service.get(req.params.id));
});

materialVariantRouter.post(
  "/",
  async (req: Request<void, unknown, MaterialVariantModel>, res) => {
    res.send(await service.createVariant(req.body));
  },
);

materialVariantRouter.patch(
  "/:id",
  async (
    req: Request<{ id: number }, unknown, Partial<MaterialVariantModel>>,
    res,
  ) => {
    res.send(await service.updateVariant(req.params.id, req.body));
  },
);

materialVariantRouter.delete(
  "/:id",
  async (req: Request<{ id: number }>, res) => {
    await service.deleteVariant(req.params.id);
    res.send({ message: `${String(req.params.id)} deleted` });
  },
);

export default materialVariantRouter;