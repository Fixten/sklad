import { Request, Router } from "express";
import { WithId } from "mongodb";

import { WithDb } from "@/db/WithDb.js";

import variantService from "../material.service/variant.service.js";

import type { VariantModel } from "../material.model.js";

const variantRouter = Router();

variantRouter.post(
  "/",
  async (
    req: Request<
      void,
      WithId<WithDb<VariantModel>>,
      { variant: VariantModel; id: string }
    >,
    res
  ) => {
    res.send(await variantService.createVariant(req.body.id, req.body.variant));
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

// variantRouter.delete("/:id", async (req: Request<{ id: string }>, res) => {
//   await variantService.deletevariant(req.params.id);
//   res.send({ message: `${req.params.id} deleted` });
// });

export default variantRouter;
