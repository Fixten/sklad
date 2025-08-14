import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

import bodyParser from "body-parser";
import cors from "cors";
import { config } from "dotenv";
import express from "express";

import dbConnection from "./db/dbConnection.js";
import materialTypeRouter from "./features/materialType/materialType.route.js";
import settingsRouter from "./features/settings/settings.route.js";
import supplyRouter from "./features/supply/supply.route.js";
import unitRouter from "./features/units/unit.route.js";

export default async function getServer() {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  config({ path: resolve(__dirname, "../../.env") });

  const app = express();
  app.use(cors());
  await dbConnection.connect();

  app.use(bodyParser.json());
  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  app.use("/settings", settingsRouter);
  app.use("/units", unitRouter);
  app.use("/material-type", materialTypeRouter);
  app.use("/supply", supplyRouter);

  return app;
}
