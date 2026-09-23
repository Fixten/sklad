import { existsSync } from "node:fs";
import { join } from "node:path";

import bodyParser from "body-parser";
import cors from "cors";
import express, { Router, static as expressStatic } from "express";

import { Urls } from "./constants/Urls.js";
import DbSingleton from "./db/index.js";
import { errorHandler } from "./errors.middleware.js";
import materialRouter from "./features/material/material.router.js";
import materialTypeRouter from "./features/materialType/materialType.router.js";
import materialVariantRouter from "./features/materialVariant/materialVariant.router.js";
import settingsRouter from "./features/settings/settings.router.js";
import supplierRouter from "./features/supplier/supplier.router.js";
import supplyRouter from "./features/supply/supply.router.js";
import { SWAGGER_UI_ASSETS, swaggerInitializer } from "./openapi/ui.js";
import { ErrorMessages } from "./constants/Errors.js";

const specJsonPath = join(process.cwd(), "public", "spec.json");

export default function getServer() {
  DbSingleton.init();

  const app = express();
  app.use(cors());
  app.use(bodyParser.json());

  const apiRouter = Router();
  apiRouter.get("/", (_, res) => {
    res.send("Hello World!");
  });
  apiRouter.get(Urls.docsSpec, (_req, res) => {
    if (!existsSync(specJsonPath)) {
      res.status(404).json({ error: ErrorMessages.OPENAPI_NOT_FOUND });
      return;
    }
    res.sendFile(specJsonPath);
  });
  apiRouter.get(`${Urls.docs}/swagger-initializer.js`, (_req, res) => {
    res.type("application/javascript").send(swaggerInitializer);
  });
  apiRouter.use(Urls.docs, expressStatic(SWAGGER_UI_ASSETS));
  apiRouter.use(Urls.settings, settingsRouter);
  apiRouter.use(Urls.materialType, materialTypeRouter);
  apiRouter.use(Urls.materialVariant, materialVariantRouter);
  apiRouter.use(Urls.material, materialRouter);
  apiRouter.use(Urls.supply, supplyRouter);
  apiRouter.use(Urls.supplier, supplierRouter);

  app.use(Urls.apiBase, apiRouter);
  app.use(errorHandler);
  return app;
}
