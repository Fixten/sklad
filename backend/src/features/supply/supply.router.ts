import { Request, Router } from "express";

import { IdParamsZ } from "@/openapi/common.zod.js";
import { sendDeleted, sendSpec, validateBody, validateParams } from "@/openapi/validation.js";

import { SupplyModel, SupplySchema } from "./supply.schema.js";
import supplyService from "./supply.service.js";
import { supplyCreateZ, supplyRowListZ, supplyRowZ, supplyUpdateZ } from "./supply.zod.js";

const supplyRouter = Router();

const service = supplyService.getSingleton();

const sendRow = sendSpec(supplyRowZ);
const sendList = sendSpec(supplyRowListZ);

supplyRouter.get("/", async (req, res) => {
  sendList(res, await service.getAll());
});

supplyRouter.post(
  "/",
  validateBody(supplyCreateZ),
  async (req: Request<Record<string, string>, SupplySchema, SupplyModel>, res) => {
    sendRow(res, await service.create(req.body));
  },
);

supplyRouter.post(
  "/:id",
  validateParams(IdParamsZ),
  validateBody(supplyUpdateZ),
  async (req: Request<{ id: string }, SupplySchema, SupplyModel>, res) => {
    sendRow(res, await service.update(Number(req.params.id), req.body));
  },
);

supplyRouter.delete(
  "/:id",
  validateParams(IdParamsZ),
  async (req: Request<{ id: string }>, res) => {
    await service.hardDelete(Number(req.params.id));
    sendDeleted(res, req.params.id);
  },
);

export default supplyRouter;