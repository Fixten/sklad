import { Request, Router } from "express";

import { IdParamsZ } from "@/openapi/common.zod.js";
import {
  sendDeleted,
  sendSpec,
  validateBody,
  validateParams,
} from "@/openapi/validation.js";

import { MaterialTypeModel } from "./materialType.schema.js";
import MaterialTypeService from "./materialType.service.js";
import {
  materialTypeCreateZ,
  materialTypePatchZ,
  materialTypeRowListZ,
  materialTypeRowZ,
} from "./materialType.zod.js";

const materialTypeRouter = Router();

const service = MaterialTypeService.getSingleton();

const sendRow = sendSpec(materialTypeRowZ);
const sendList = sendSpec(materialTypeRowListZ);

type Id = Request<{ id: string }>;

materialTypeRouter.get("/", (req, res) => {
  sendList(res, service.getAll());
});

materialTypeRouter.get("/:id", validateParams(IdParamsZ), (req: Id, res) => {
  sendRow(res, service.get(Number(req.params.id)));
});

materialTypeRouter.post(
  "/",
  validateBody(materialTypeCreateZ),
  (req: Request<Record<string, string>, unknown, MaterialTypeModel>, res) => {
    sendRow(res, service.create(req.body));
  },
);

materialTypeRouter.patch(
  "/:id",
  validateParams(IdParamsZ),
  validateBody(materialTypePatchZ),
  (req: Request<{ id: string }, unknown, Partial<MaterialTypeModel>>, res) => {
    sendRow(res, service.update(Number(req.params.id), req.body));
  },
);

materialTypeRouter.delete("/:id", validateParams(IdParamsZ), (req: Id, res) => {
  service.delete(Number(req.params.id));
  sendDeleted(res, req.params.id);
});

materialTypeRouter.post(
  "/:id/restore",
  validateParams(IdParamsZ),
  (req: Id, res) => {
    sendRow(res, service.restore(Number(req.params.id)));
  },
);

export default materialTypeRouter;
