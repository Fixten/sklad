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

import { ProductTemplateService } from "./productTemplate.service.js";
import {
  productTemplateCreateZ,
  productTemplateDetailZ,
  productTemplateListQueryZ,
  productTemplatePatchZ,
  productTemplateRowListZ,
} from "./productTemplate.zod.js";

import type {
  ProductTemplateCreate,
  ProductTemplateListQuery,
  ProductTemplatePatch,
} from "./productTemplate.zod.js";

const productTemplateRouter = Router();

const service = ProductTemplateService.getSingleton();

const sendDetail = sendSpec(productTemplateDetailZ);
const sendList = sendSpec(productTemplateRowListZ);

type Id = Request<{ id: string }>;

productTemplateRouter.get(
  "/",
  validateQuery(productTemplateListQueryZ),
  (_req, res) => {
    const { hidden } = queryOf(res) as ProductTemplateListQuery;
    sendList(res, service.getAll({ includeHidden: hidden }));
  },
);

productTemplateRouter.get("/:id", validateParams(IdParamsZ), (req: Id, res) => {
  sendDetail(res, service.get(Number(req.params.id)));
});

productTemplateRouter.post(
  "/",
  validateBody(productTemplateCreateZ),
  (
    req: Request<Record<string, string>, unknown, ProductTemplateCreate>,
    res,
  ) => {
    sendDetail(res, service.create(req.body));
  },
);

productTemplateRouter.patch(
  "/:id",
  validateParams(IdParamsZ),
  validateBody(productTemplatePatchZ),
  (req: Request<{ id: string }, unknown, ProductTemplatePatch>, res) => {
    sendDetail(res, service.update(Number(req.params.id), req.body));
  },
);

productTemplateRouter.delete(
  "/:id",
  validateParams(IdParamsZ),
  (req: Id, res) => {
    service.delete(Number(req.params.id));
    sendDeleted(res, req.params.id);
  },
);

productTemplateRouter.post(
  "/restore/:id",
  validateParams(IdParamsZ),
  (req: Id, res) => {
    sendDetail(res, service.restore(Number(req.params.id)));
  },
);

export default productTemplateRouter;
