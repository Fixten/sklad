import { Request, Router } from "express";
import { WithId } from "mongodb";

import { WithDb } from "@/db/WithDb.js";

import variantService from "../material.service/variant.service.js";

import type { VariantDTO, VariantModel } from "../material.model.js";

const variantRouter = Router();

variantRouter.post(
  "/",
  async (req: Request<void, WithId<WithDb<VariantModel>>, VariantDTO>, res) => {
    res.send(
      await variantService.createVariant(req.body.materialId, req.body.variant)
    );
  }
);

// variantRouter.post(
//   "/:id",
//   async (
//     req: Request<{ id: string }, WithId<WithDb<variantModel>>, variantDTO>,
//     res
//   ) => {
//     res.send(await variantService.updatevariant(req.params.id, req.body));
//   }
// );

variantRouter.delete(
  "/:materialId/:variantId",
  async (req: Request<{ materialId: string; variantId: string }>, res) => {
    await variantService.deleteVariant(
      req.params.materialId,
      req.params.variantId
    );
    res.send({ message: `${req.params.variantId} deleted` });
  }
);

export default variantRouter;
