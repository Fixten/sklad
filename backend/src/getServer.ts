import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

import bodyParser from "body-parser";
import cors from "cors";
import { config } from "dotenv";
import express from "express";

import dbConnection from "./db/dbConnection.js";
import settingsRouter from "./features/settings/settings.route.js";
import unitRouter from "./features/units/unit.route.js";

export default function getServer() {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  config({ path: resolve(__dirname, "../../.env") });

  const app = express();
  app.use(cors());
  dbConnection.connect();

  app.use(bodyParser.json());
  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  app.use("/settings", settingsRouter);
  app.use("/units", unitRouter);
  
  return app;
}
