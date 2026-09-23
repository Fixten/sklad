import { Request, Router } from "express";

import { IdParamsZ } from "@/openapi/common.zod.js";
import { sendDeleted, sendSpec, validateBody, validateParams } from "@/openapi/validation.js";

import { MaterialVariantModel } from "./materialVariant.schema.js";
import { MaterialVariantService } from "./materialVariant.service.js";
import {
  materialVariantCreateZ,
  materialVariantPatchZ,
  materialVariantRowListZ,
  materialVariantRowZ,
} from "./materialVariant.zod.js";

const materialVariantRouter = Router();

const service = MaterialVariantService.getSingleton();

const sendRow = sendSpec(materialVariantRowZ);
const sendList = sendSpec(materialVariantRowListZ);

type Id = Request<{ id: string }>;

materialVariantRouter.get("/", async (req, res) => {
  sendList(res, await service.getAll());
});

materialVariantRouter.get(
  "/:id",
  validateParams(IdParamsZ),
  async (req: Id, res) => {
    sendRow(res, await service.get(Number(req.params.id)));
  },
);

materialVariantRouter.post(
  "/",
  validateBody(materialVariantCreateZ),
  async (req: Request<Record<string, string>, unknown, MaterialVariantModel>, res) => {
    sendRow(res, await service.createVariant(req.body));
  },
);

materialVariantRouter.patch(
  "/:id",
  validateParams(IdParamsZ),
  validateBody(materialVariantPatchZ),
  async (
    req: Request<{ id: string }, unknown, Partial<MaterialVariantModel>>,
    res,
  ) => {
    sendRow(res, await service.updateVariant(Number(req.params.id), req.body));
  },
);

materialVariantRouter.delete(
  "/:id",
  validateParams(IdParamsZ),
  async (req: Id, res) => {
    await service.deleteVariant(Number(req.params.id));
    sendDeleted(res, req.params.id);
  },
);

export default materialVariantRouter;