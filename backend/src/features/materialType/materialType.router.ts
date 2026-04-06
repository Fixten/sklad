import { Request, Router } from "express";

import {
  MaterialTypeModel,
  MaterialTypeSchema,
} from "./materialType.schema.js";
import MaterialTypeService from "./materialType.service.js";

const materialTypeRouter = Router();

const service = MaterialTypeService.getSingleton();
materialTypeRouter.get("/", async (req, res) => {
  const result = await service.getAll();
  res.send(result);
});

materialTypeRouter.get("/id", async (req: Request<{ id: number }>, res) => {
  const result = await service.get(req.params.id);
  res.send(result);
});

materialTypeRouter.post(
  "/",
  async (req: Request<void, MaterialTypeSchema, MaterialTypeModel>, res) => {
    const result = await service.addNew(req.body);
    res.send(result);
  },
);

materialTypeRouter.delete("/:id", async (req: Request<{ id: number }>, res) => {
  await service.delete(req.params.id);
  res.send({ message: `${String(req.params.id)} deleted` });
});

export default materialTypeRouter;
