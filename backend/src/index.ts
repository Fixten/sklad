import { ErrorMessages } from "./constants/Errors.js";
import getServer from "./getServer.js";

const server = getServer();
const { BACKEND_PORT } = process.env;
if (BACKEND_PORT) {
  server.listen(BACKEND_PORT, () => {
    console.log(`Sklad app listening on port ${BACKEND_PORT}`);
  });
} else throw new Error(ErrorMessages.BACKEND_PORT_NOT_SET);
