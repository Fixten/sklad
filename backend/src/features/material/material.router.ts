import { Request, Router } from "express";

import { MaterialModel } from "./material.schema.js";
import { MaterialService } from "./material.service.js";

const materialRouter = Router();

const service = MaterialService.getSingleton();

materialRouter.get("/", async (req, res) => {
  res.send(await service.getAll());
});

materialRouter.get("/:id", async (req: Request<{ id: number }>, res) => {
  res.send(await service.get(req.params.id));
});

materialRouter.post(
  "/",
  async (req: Request<void, unknown, MaterialModel>, res) => {
    res.send(await service.create(req.body));
  },
);

materialRouter.patch(
  "/:id",
  async (
    req: Request<{ id: number }, unknown, Partial<MaterialModel>>,
    res,
  ) => {
    res.send(await service.update(req.params.id, req.body));
  },
);

materialRouter.delete("/:id", async (req: Request<{ id: number }>, res) => {
  await service.delete(req.params.id);
  res.send({ message: `${String(req.params.id)} deleted` });
});

export default materialRouter;