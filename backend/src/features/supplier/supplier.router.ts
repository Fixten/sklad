import { Request, Router } from "express";

import { IdParamsZ } from "@/openapi/common.zod.js";
import { sendDeleted, sendSpec, validateBody, validateParams } from "@/openapi/validation.js";

import { SupplierModel, SupplierSchema } from "./supplier.schema.js";
import SupplierService from "./supplier.service.js";
import {
  supplierCreateZ,
  supplierRowListZ,
  supplierRowZ,
  supplierUpdateZ,
} from "./supplier.zod.js";

const supplierRouter = Router();

const service = SupplierService.getSingleton();

const sendRow = sendSpec(supplierRowZ);
const sendList = sendSpec(supplierRowListZ);

supplierRouter.get("/", async (req, res) => {
  sendList(res, await service.getAll());
});

supplierRouter.post(
  "/",
  validateBody(supplierCreateZ),
  async (req: Request<Record<string, string>, SupplierSchema, SupplierModel>, res) => {
    sendRow(res, await service.create(req.body));
  },
);

supplierRouter.post(
  "/:id",
  validateParams(IdParamsZ),
  validateBody(supplierUpdateZ),
  async (req: Request<{ id: string }, SupplierSchema, SupplierModel>, res) => {
    sendRow(res, await service.update(Number(req.params.id), req.body));
  },
);

supplierRouter.delete(
  "/:id",
  validateParams(IdParamsZ),
  async (req: Request<{ id: string }>, res) => {
    await service.delete(Number(req.params.id));
    sendDeleted(res, req.params.id);
  },
);

export default supplierRouter;