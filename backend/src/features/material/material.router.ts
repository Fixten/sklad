import { Request, Router } from "express";

import { IdParamsZ } from "@/openapi/common.zod.js";
import { sendDeleted, sendSpec, validateBody, validateParams } from "@/openapi/validation.js";

import { MaterialModel } from "./material.schema.js";
import { MaterialService } from "./material.service.js";
import {
  materialCreateZ,
  materialPatchZ,
  materialRowListZ,
  materialRowZ,
} from "./material.zod.js";

const materialRouter = Router();

const service = MaterialService.getSingleton();

const sendRow = sendSpec(materialRowZ);
const sendList = sendSpec(materialRowListZ);

type Id = Request<{ id: string }>;

materialRouter.get("/", async (req, res) => {
  sendList(res, await service.getAll());
});

materialRouter.get(
  "/:id",
  validateParams(IdParamsZ),
  async (req: Id, res) => {
    sendRow(res, await service.get(Number(req.params.id)));
  },
);

materialRouter.post(
  "/",
  validateBody(materialCreateZ),
  async (req: Request<Record<string, string>, unknown, MaterialModel>, res) => {
    sendRow(res, await service.create(req.body));
  },
);

materialRouter.patch(
  "/:id",
  validateParams(IdParamsZ),
  validateBody(materialPatchZ),
  async (
    req: Request<{ id: string }, unknown, Partial<MaterialModel>>,
    res,
  ) => {
    sendRow(res, await service.update(Number(req.params.id), req.body));
  },
);

materialRouter.delete(
  "/:id",
  validateParams(IdParamsZ),
  async (req: Id, res) => {
    await service.delete(Number(req.params.id));
    sendDeleted(res, req.params.id);
  },
);

export default materialRouter;