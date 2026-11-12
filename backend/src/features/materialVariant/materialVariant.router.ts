import { Request, Router } from "express";

import { IdParamsZ } from "@/openapi/common.zod.js";
import {
  queryOf,
  sendDeleted,
  sendSpec,
  validateBody,
  validateParams,
  validateQuery,
} from "@/openapi/validation.js";

import { MaterialVariantModel } from "./materialVariant.schema.js";
import { MaterialVariantService } from "./materialVariant.service.js";
import {
  materialVariantCreateZ,
  materialVariantDetailZ,
  materialVariantListQueryZ,
  materialVariantPatchZ,
  materialVariantRowListZ,
} from "./materialVariant.zod.js";

const materialVariantRouter = Router();

const service = MaterialVariantService.getSingleton();

const sendRow = sendSpec(materialVariantDetailZ);
const sendList = sendSpec(materialVariantRowListZ);

type Id = Request<{ id: string }>;

materialVariantRouter.get(
  "/",
  validateQuery(materialVariantListQueryZ),
  (_req, res) => {
    const { hidden } = queryOf(res) as { hidden?: boolean };
    sendList(res, service.getAll({ includeHidden: hidden }));
  },
);

materialVariantRouter.get("/:id", validateParams(IdParamsZ), (req: Id, res) => {
  sendRow(res, service.get(Number(req.params.id)));
});

materialVariantRouter.post(
  "/",
  validateBody(materialVariantCreateZ),
  (
    req: Request<Record<string, string>, unknown, MaterialVariantModel>,
    res,
  ) => {
    sendRow(res, service.createVariant(req.body));
  },
);

materialVariantRouter.patch(
  "/:id",
  validateParams(IdParamsZ),
  validateBody(materialVariantPatchZ),
  (
    req: Request<{ id: string }, unknown, Partial<MaterialVariantModel>>,
    res,
  ) => {
    sendRow(res, service.updateVariant(Number(req.params.id), req.body));
  },
);

materialVariantRouter.delete(
  "/:id",
  validateParams(IdParamsZ),
  (req: Id, res) => {
    service.delete(Number(req.params.id));
    sendDeleted(res, req.params.id);
  },
);

materialVariantRouter.post(
  "/restore/:id",
  validateParams(IdParamsZ),
  (req: Id, res) => {
    sendRow(res, service.restore(Number(req.params.id)));
  },
);

export default materialVariantRouter;
