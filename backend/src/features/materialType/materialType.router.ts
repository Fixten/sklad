import { Request, Router } from "express";

import { IdParamsZ } from "@/openapi/common.zod.js";
import { sendDeleted, sendSpec, validateBody, validateParams } from "@/openapi/validation.js";

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

materialTypeRouter.get("/", async (req, res) => {
  sendList(res, await service.getAll());
});

materialTypeRouter.get(
  "/:id",
  validateParams(IdParamsZ),
  async (req: Id, res) => {
    sendRow(res, await service.get(Number(req.params.id)));
  },
);

materialTypeRouter.post(
  "/",
  validateBody(materialTypeCreateZ),
  async (req: Request<Record<string, string>, unknown, MaterialTypeModel>, res) => {
    sendRow(res, await service.create(req.body));
  },
);

materialTypeRouter.patch(
  "/:id",
  validateParams(IdParamsZ),
  validateBody(materialTypePatchZ),
  async (req: Request<{ id: string }, unknown, Partial<MaterialTypeModel>>, res) => {
    sendRow(res, await service.update(Number(req.params.id), req.body));
  },
);

materialTypeRouter.delete(
  "/:id",
  validateParams(IdParamsZ),
  async (req: Id, res) => {
    await service.delete(Number(req.params.id));
    sendDeleted(res, req.params.id);
  },
);

export default materialTypeRouter;