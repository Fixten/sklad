import { Request, Router } from "express";

import materialTypeService from "./materialType.service.js";
import {
  MaterialTypeModel,
  MaterialTypeSchema,
} from "./materialType.schema.js";

const materialTypeRouter = Router();

materialTypeRouter.get("/", async (req, res) => {
  const result = await materialTypeService.getAll();
  res.send(result);
});

materialTypeRouter.get("/id", async (req: Request<{ id: number }>, res) => {
  const result = await materialTypeService.get(req.params.id);
  res.send(result);
});

materialTypeRouter.post(
  "/",
  async (req: Request<void, MaterialTypeSchema, MaterialTypeModel>, res) => {
    const result = await materialTypeService.addNew(req.body);
    res.send(result);
  },
);

materialTypeRouter.delete("/:id", async (req: Request<{ id: number }>, res) => {
  await materialTypeService.delete(req.params.id);
  res.send({ message: `${req.params.id} deleted` });
});

export default materialTypeRouter;
