import { Request, Router } from "express";

import {
  MaterialVariantModel,
  MaterialVariantSchema,
} from "./materialVariant.schema.js";
import { MaterialVariantService } from "./materialVariant.service.js";

const materialVariantRouter = Router();

const service = MaterialVariantService.getSingleton();

materialVariantRouter.post(
  "/",
  async (
    req: Request<void, MaterialVariantSchema, MaterialVariantModel>,
    res,
  ) => {
    res.send(await service.createVariant(req.body));
  },
);

materialVariantRouter.post(
  "/:id",
  async (
    req: Request<{ id: number }, MaterialVariantSchema, MaterialVariantModel>,
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
