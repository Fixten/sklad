import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

import bodyParser from "body-parser";
import { config } from "dotenv";
import express from "express";

import settingsRouter from "features/settings/settings.route.js";

import dbConnection from "./db/dbConnection.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../../.env") });
dbConnection.connect();
const app = express();

const { BACKEND_PORT } = process.env;

if (BACKEND_PORT) {
  app.use(bodyParser.json());
  app.get("/", (req, res) => {
    res.send("Hello World!");
  });
  app.use("/settings", settingsRouter);

  app.listen(BACKEND_PORT, () => {
    console.log(`Sklad app listening on port ${BACKEND_PORT}`);
  });
} else throw new Error("Environment variables are not set");
