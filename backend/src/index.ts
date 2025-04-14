import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

import dotenv from "dotenv";
import express from "express";


const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "../../.env") });

const app = express();

const { BACKEND_PORT } = process.env;

if (BACKEND_PORT) {
  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  app.listen(BACKEND_PORT, () => {
    console.log(`Sklad app listening on port ${BACKEND_PORT}`);
  });
} else throw new Error("Environment variables are not set");
