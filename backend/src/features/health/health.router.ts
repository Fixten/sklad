import { Router } from "express";

import { sendSpec } from "@/openapi/validation.js";

import HealthService from "./health.service.js";
import { healthFailZ, healthOkZ } from "./health.zod.js";

const healthRouter = Router();

const service = HealthService.getSingleton();

healthRouter.get("/", (_req, res) => {
  const ok = service.check();
  res.status(ok ? 200 : 503);
  sendSpec(ok ? healthOkZ : healthFailZ)(res, { status: ok ? "ok" : "error" });
});

export default healthRouter;
