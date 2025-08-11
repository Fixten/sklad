import { Request, Router } from "express";
import { WithId } from "mongodb";

import { WithDb } from "@/db/WithDb.js";

import { MaterialTypeModel } from "./materialType.model.js";
import materialTypeService from "./materialType.service.js";

const materialTypeRouter = Router();

materialTypeRouter.get("/", async (req, res) => {
  const result = await materialTypeService.getAll();
  res.send(result);
});

materialTypeRouter.post(
  "/",
  async (
    req: Request<void, WithId<WithDb<MaterialTypeModel>>, MaterialTypeModel>,
    res
  ) => {
    const result = await materialTypeService.addNew(req.body);
    res.send(result);
  }
);

materialTypeRouter.delete(
  "/:id",
  async (req: Request<{ id: string }, { message: string }>, res) => {
    await materialTypeService.delete(req.params.id);
    res.send({ message: `${req.params.id} deleted` });
  }
);

export default materialTypeRouter;
