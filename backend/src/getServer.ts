import bodyParser from "body-parser";
import cors from "cors";
import express from "express";

import dbConnection from "./db/dbConnection.js";
import materialRouter from "./features/material/material.router/material.router.js";
import materialTypeRouter from "./features/materialType/materialType.router.js";
import settingsRouter from "./features/settings/settings.router.js";
import supplyRouter from "./features/supply/supply.router.js";

export default async function getServer() {
  const app = express();
  app.use(cors());
  await dbConnection.connect();

  app.use(bodyParser.json());
  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  app.use("/settings", settingsRouter);
  app.use("/material-type", materialTypeRouter);
  app.use("/material", materialRouter);
  app.use("/supply", supplyRouter);

  return app;
}
