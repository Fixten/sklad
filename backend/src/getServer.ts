import bodyParser from "body-parser";
import cors from "cors";
import express, { Router } from "express";

import DbSingleton from "./db/index.js";
import materialRouter from "./features/material/material.router.js";
import materialTypeRouter from "./features/materialType/materialType.router.js";
import settingsRouter from "./features/settings/settings.router.js";
import supplyRouter from "./features/supply/supply.router.js";
import materialVariantRouter from "./features/materialVariant/materialVariant.router.js";
import supplierRouter from "./features/supplier/supplier.router.js";
import { Urls } from "./constants/Urls.js";

export default function getServer() {
  DbSingleton.init();

  const app = express();
  app.use(cors());
  app.use(bodyParser.json());

  const apiRouter = Router();
  apiRouter.get("/", (_, res) => {
    res.send("Hello World!");
  });
  apiRouter.use(Urls.settings, settingsRouter);
  apiRouter.use(Urls.materialType, materialTypeRouter);
  apiRouter.use(Urls.materialVariant, materialVariantRouter);
  apiRouter.use(Urls.materialVariant, materialRouter);
  apiRouter.use(Urls.supply, supplyRouter);
  apiRouter.use(Urls.supplier, supplierRouter);

  app.use("/api", apiRouter);
  return app;
}
