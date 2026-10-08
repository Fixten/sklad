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

import supplyService from "./supply.service.js";
import {
  supplyCreateZ,
  supplyListQueryZ,
  supplyPatchZ,
  supplyRowListZ,
  supplyRowZ,
  supplyStockZ,
} from "./supply.zod.js";

import type { SupplyFilter } from "./supply.repository.js";
import type { SupplyCreateInput, SupplyUpdateInput } from "./supply.service.js";

const supplyRouter = Router();

const service = supplyService.getSingleton();

const sendRow = sendSpec(supplyRowZ);
const sendList = sendSpec(supplyRowListZ);
const sendStock = sendSpec(supplyStockZ);

type Id = Request<{ id: string }>;

supplyRouter.get("/", validateQuery(supplyListQueryZ), (_req, res) => {
  sendList(res, service.getAll(queryOf(res) as SupplyFilter));
});

supplyRouter.get("/stock/:id", validateParams(IdParamsZ), (req: Id, res) => {
  sendStock(res, service.getStock(Number(req.params.id)));
});

supplyRouter.get("/:id", validateParams(IdParamsZ), (req: Id, res) => {
  sendRow(res, service.get(Number(req.params.id)));
});

supplyRouter.post(
  "/",
  validateBody(supplyCreateZ),
  (req: Request<Record<string, string>, unknown, SupplyCreateInput>, res) => {
    sendRow(res, service.create(req.body));
  },
);

supplyRouter.patch(
  "/:id",
  validateParams(IdParamsZ),
  validateBody(supplyPatchZ),
  (req: Request<{ id: string }, unknown, SupplyUpdateInput>, res) => {
    sendRow(res, service.update(Number(req.params.id), req.body));
  },
);

supplyRouter.delete("/:id", validateParams(IdParamsZ), (req: Id, res) => {
  service.delete(Number(req.params.id));
  sendDeleted(res, req.params.id);
});

supplyRouter.post("/restore/:id", validateParams(IdParamsZ), (req: Id, res) => {
  sendRow(res, service.restore(Number(req.params.id)));
});

export default supplyRouter;
