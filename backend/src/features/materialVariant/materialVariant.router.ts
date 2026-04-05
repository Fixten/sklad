import { Request, Router } from "express";

import {
  MaterialVariantModel,
  MaterialVariantSchema,
} from "./materialVariant.schema.js";
import { MaterialVariantService } from "./materialVariant.service.js";

const variantRouter = Router();

const service = MaterialVariantService.getSingleton();

variantRouter.post(
  "/",
  async (
    req: Request<void, MaterialVariantSchema, MaterialVariantModel>,
    res,
  ) => {
    res.send(await service.createVariant(req.body));
  },
);

variantRouter.post(
  "/:id",
  async (
    req: Request<{ id: number }, MaterialVariantSchema, MaterialVariantModel>,
    res,
  ) => {
    res.send(await service.updateVariant(req.params.id, req.body));
  },
);

variantRouter.delete("/:id", async (req: Request<{ id: number }>, res) => {
  await service.deleteVariant(req.params.id);
  res.send({ message: `${req.params.id} deleted` });
});

export default variantRouter;
