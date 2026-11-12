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

import { MaterialModel } from "./material.schema.js";
import { MaterialService } from "./material.service.js";
import {
  materialCreateZ,
  materialListQueryZ,
  materialPatchZ,
  materialRowListZ,
  materialRowZ,
} from "./material.zod.js";

const materialRouter = Router();

const service = MaterialService.getSingleton();

const sendRow = sendSpec(materialRowZ);
const sendList = sendSpec(materialRowListZ);

type Id = Request<{ id: string }>;

materialRouter.get("/", validateQuery(materialListQueryZ), (_req, res) => {
  const { hidden } = queryOf(res) as { hidden?: boolean };
  sendList(res, service.getAll({ includeHidden: hidden }));
});

materialRouter.get("/:id", validateParams(IdParamsZ), (req: Id, res) => {
  sendRow(res, service.get(Number(req.params.id)));
});

materialRouter.post(
  "/",
  validateBody(materialCreateZ),
  (req: Request<Record<string, string>, unknown, MaterialModel>, res) => {
    sendRow(res, service.create(req.body));
  },
);

materialRouter.patch(
  "/:id",
  validateParams(IdParamsZ),
  validateBody(materialPatchZ),
  (req: Request<{ id: string }, unknown, Partial<MaterialModel>>, res) => {
    sendRow(res, service.update(Number(req.params.id), req.body));
  },
);

materialRouter.delete("/:id", validateParams(IdParamsZ), (req: Id, res) => {
  service.delete(Number(req.params.id));
  sendDeleted(res, req.params.id);
});

materialRouter.post(
  "/restore/:id",
  validateParams(IdParamsZ),
  (req: Id, res) => {
    sendRow(res, service.restore(Number(req.params.id)));
  },
);

export default materialRouter;
