import { Request, Router } from "express";

import { IdParamsZ } from "@/openapi/common.zod.js";
import {
  sendDeleted,
  sendSpec,
  validateBody,
  validateParams,
} from "@/openapi/validation.js";

import SupplierService from "./supplier.service.js";
import {
  supplierCreateZ,
  supplierPatchZ,
  supplierRowListZ,
  supplierRowZ,
} from "./supplier.zod.js";

import type {
  SupplierCreateInput,
  SupplierUpdateInput,
} from "./supplier.service.js";

const supplierRouter = Router();

const service = SupplierService.getSingleton();

const sendRow = sendSpec(supplierRowZ);
const sendList = sendSpec(supplierRowListZ);

type Id = Request<{ id: string }>;

supplierRouter.get("/", (_req, res) => {
  sendList(res, service.getAll());
});

supplierRouter.get("/:id", validateParams(IdParamsZ), (req: Id, res) => {
  sendRow(res, service.getById(Number(req.params.id)));
});

supplierRouter.post(
  "/",
  validateBody(supplierCreateZ),
  (req: Request<Record<string, string>, unknown, SupplierCreateInput>, res) => {
    sendRow(res, service.create(req.body));
  },
);

supplierRouter.patch(
  "/:id",
  validateParams(IdParamsZ),
  validateBody(supplierPatchZ),
  (req: Request<{ id: string }, unknown, SupplierUpdateInput>, res) => {
    sendRow(res, service.update(Number(req.params.id), req.body));
  },
);

supplierRouter.delete("/:id", validateParams(IdParamsZ), (req: Id, res) => {
  service.delete(Number(req.params.id));
  sendDeleted(res, req.params.id);
});

supplierRouter.post(
  "/:id/restore",
  validateParams(IdParamsZ),
  (req: Id, res) => {
    sendRow(res, service.restore(Number(req.params.id)));
  },
);

export default supplierRouter;
