import { config } from "dotenv";

import getServer from "./getServer.js";

async function startApp() {
  config({ path: "../.env" });

  const server = await getServer();
  const { BACKEND_PORT } = process.env;
  if (BACKEND_PORT) {
    server.listen(BACKEND_PORT, () => {
      console.log(`Sklad app listening on port ${BACKEND_PORT}`);
    });
  } else throw new Error("BACKEND_PORT is not set");
}

await startApp();
