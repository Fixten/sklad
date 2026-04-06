import bodyParser from "body-parser";
import cors from "cors";
import express, { Router } from "express";

import DbSingleton from "./db/index.js";
import materialRouter from "./features/material/material.router.js";
import materialTypeRouter from "./features/materialType/materialType.router.js";
import settingsRouter from "./features/settings/settings.router.js";
import supplyRouter from "./features/supply/supply.router.js";

export default function getServer() {
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());
  DbSingleton.connect();
  const apiRouter = Router();
  apiRouter.get("/", (_, res) => {
    res.send("Hello World!");
  });
  apiRouter.use("/settings", settingsRouter);
  apiRouter.use("/material-type", materialTypeRouter);
  apiRouter.use("/material", materialRouter);
  apiRouter.use("/supply", supplyRouter);

  app.use("/api", apiRouter);
  return app;
}
