import { Request, Router } from "express";
import { WithId } from "mongodb";

import { WithDb } from "@/db/WithDb.js";

import { MaterialDTO, MaterialModel } from "../material.model.js";
import materialService from "../material.service/material.service.js";

import variantRouter from "./variant.router.js";

const materialRouter = Router();
materialRouter.use("/variants", variantRouter);

materialRouter.get("/", async (req, res) => {
  res.send(await materialService.getAll());
});

materialRouter.post(
  "/",
  async (
    req: Request<
      void,
      WithId<WithDb<MaterialModel>>,
      Omit<MaterialDTO, "variants">
    >,
    res
  ) => {
    res.send(await materialService.create(req.body));
  }
);

materialRouter.post(
  "/:id",
  async (
    req: Request<{ id: string }, WithId<WithDb<MaterialModel>>, MaterialDTO>,
    res
  ) => {
    res.send(await materialService.updateMaterial(req.params.id, req.body));
  }
);

materialRouter.delete("/:id", async (req: Request<{ id: string }>, res) => {
  await materialService.deleteMaterial(req.params.id);
  res.send({ message: `${req.params.id} deleted` });
});

export default materialRouter;
