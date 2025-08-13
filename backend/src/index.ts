import getServer from "./getServer.js";

async function startApp() {
  const server = await getServer();
  const { BACKEND_PORT } = process.env;
  if (BACKEND_PORT) {
    server.listen(BACKEND_PORT, () => {
      console.log(`Sklad app listening on port ${BACKEND_PORT}`);
    });
  } else throw new Error("BACKEND_PORT is not set");
}

await startApp();
