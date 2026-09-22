import { Request, Router } from "express";

import { SupplierModel, SupplierSchema } from "./supplier.schema.js";
import SupplierService from "./supplier.service.js";

const supplierRouter = Router();

const service = SupplierService.getSingleton();

supplierRouter.get("/", async (req, res) => {
  res.send(await service.getAll());
});

supplierRouter.post(
  "/",
  async (req: Request<void, SupplierSchema, SupplierModel>, res) => {
    res.send(await service.create(req.body));
  },
);

supplierRouter.post(
  "/:id",
  async (req: Request<{ id: number }, SupplierSchema, SupplierModel>, res) => {
    const result = await service.update(req.params.id, req.body);
    res.send(result);
  },
);

supplierRouter.delete(
  "/:id",
  async (req: Request<{ id: number }, "softDelete" | "hardDelete">, res) => {
    res.send(await service.delete(req.params.id));
  },
);

export default supplierRouter;
