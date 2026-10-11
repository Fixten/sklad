import { ErrorMessages } from "@/constants/Errors.js";

import { bootstrap } from "./e2eSetup.js";

const { BACKEND_PORT } = process.env;
if (!BACKEND_PORT) throw new Error(ErrorMessages.BACKEND_PORT_NOT_SET);
bootstrap().listen(BACKEND_PORT);
